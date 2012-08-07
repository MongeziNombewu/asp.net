/* Software Copyright Notice

Copyright © 2004-2010 MXit Lifestyle Development Company (Pty) Ltd.
All rights are reserved

Copyright exists in this computer program and it is protected by
copyright law and by international treaties. The unauthorised use,
reproduction or distribution of this computer program constitute
acts of copyright infringement and may result in civil and criminal
penalties. Any infringement will be prosecuted to the maximum extent
possible.

MXit Lifestyle Development Company (Pty) Ltd chooses the following
address for delivery of all legal proceedings and notices:
Riesling House,
Brandwacht Office Park,
Trumali Road,
Stellenbosch,
7600,
South Africa.

The following computer programs, or portions thereof, are used in
this computer program under licenses obtained from third parties.
You are obliged to familiarise yourself with the contents of those
licenses.

[List third party software used in code] */

/// Remember, $ means the "jQuery" object.


function dhtmlLoadScript(url, callback) {
    // Derived from jquery http://stackoverflow.com/questions/756382/bookmarklet-wait-until-javascript-is-loaded
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;

    // Attach handlers for all browsers
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState
                                        || this.readyState == "loaded"
                                        || this.readyState == "complete")) {
            done = true;

            if (callback !== undefined) {
                // Continue your code
                callback();
            }

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };

    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
    head.insertBefore(script, head.firstChild);
}

var scriptSource = (function () {
    var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];

    if (script.getAttribute.length !== undefined) {
        return script.getAttribute('src')
    }

    return script.getAttribute('src', 2)
} ());

function loadCSS(url) {
    var c = document.createElement("link");
    c.rel = 'stylesheet';
    c.href = url;
    c.type = "text/css";
    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(c, head.firstChild);
}

var pathname = scriptSource;
var loc = pathname.substring(0, pathname.lastIndexOf('/') + 1);

// var loc = 'jquery/';
// Load the stylesheet required
loadCSS(loc + 'mxit-gaming.css');

// Load JSON class required:
dhtmlLoadScript(loc + "json2.js");
// Load jquery
//dhtmlLoadScript(loc + "jquery-1.4.2.js", startJQuery);
dhtmlLoadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.js', startJQuery);

function startJQuery() {
    // Register the on ready event function callback with jQuery
    $(document).ready(domReady);

    function domReady() {

        $.fn.getNonColSpanIndex = function () {
            if (!$(this).is('td') && !$(this).is('th'))
                return -1;

            var allCells = this.parent('tr').children();
            var normalIndex = allCells.index(this);
            var nonColSpanIndex = 0;

            allCells.each(
                function (i, item) {
                    if (i == normalIndex)
                        return false;

                    var colspan = $(this).attr('colspan');
                    colspan = colspan ? parseInt(colspan) : 1;
                    nonColSpanIndex += colspan;
                }
              );

            return nonColSpanIndex;
        };
        // initialize the MXit gaming stuff
        // Could also be done in the body data-mxit-init="" event
        MXit.start();

    }
}

var MXit = {
    //TD_CURRENT: undefined,

    ID_OF_DIV_FOR_IMG_STRIP: 'mxitcellstrip',

    // {tablename : number}
    numberCellsCurrentlySelected: {},
    numberCellsCurrentlyPlaced: {},

    // An ordered array of currently selected CellIds, e.g. [firstCellSelectedId, secondCellSelectedId, ...],
    // first indexed by table name {'name' : [list...]}
    currentSelectedCellIds: {},
    // A list of lists
    currentSelectedCellFramesList: {},

    // An ordered array of currently placed CellIds, e.g. [firstCellPlacedId, secondCellPlacedId, ...]
    currentPlacedCellIds: {},

    // {'table' : {name -> {'frames':[frame1,frame2]} }
    tableState: {},
    // {table : {name -> bool} }
    selectedState: {},
    placedState: {},
    // { tableName : defaultImageStripList }
    tableDefaultImages: {},

    setImageStyle: function (tdElement, tdElementDiv, containerDiv, imageStripObject, imageStripIndex, imgEl) {
        // set style
        var frameWidth = imageStripObject.find("param");
        var fw;
        var fh;
        var layer;
        frameWidth.each(function (index) {
            var param = $(this);
            var name = param.attr("name");

            if (name == "fw") {
                fw = param.attr('value');
            } else if (name == "fh") {
                fh = param.attr('value');
            } else if (name == "layer") {
                layer = param.attr('value');
            }
        });
        fw = parseInt(fw);
        var right = (fw * imageStripIndex) + fw;
        var left = fw * imageStripIndex;

        containerDiv.css('width', fw + "px");  ////style.width = fw + "px";
        containerDiv.css('height', fh + "px");  ///style.height = fh + "px";

        // The cell should be at least this big
        containerDiv.css('width', fw + "px");
        containerDiv.css('height', fh + "px");
        //containerDiv.css('z-index', parseInt(layer));

        tdElementDiv.css('width', fw + "px");
        tdElementDiv.css('height', fh + "px");
        // get rid of the padding for cell's that just contain images
        tdElement.css('padding', "0px");  ///style.padding = "0px";
        //
        imgEl.css('position', 'absolute')
        // wrapper
        // imgEl.css('width', fw + "px"); ///style.width = fw + "px";
        //imgEl.css('height', fh + "px"); ///style.height = fh + "px";
        // shouldn't be more than 1000 images on a page :-O, so I'm mirroring the value from -1000
        imgEl.css('zIndex', parseInt(layer)); /// style.zIndex = -1000 + parseInt(layer);

        imgEl.css('left', "-" + left + "px"); ///style.left = "-" + left + "px";
        imgEl.css('top', "0px");  ///style.top = "0px";


    },

    /* 
    ////
    User clicks on selectable cell
    - If a placement has already been made on another cell then all previous selections and placements 
    are cleared before the operation is processed.
    - If this cell has previously been selected, then the state of the cell is returned to it’s default.
    - If selection limit has been reached (with this selection) and autosubmit is enabled, 
    then all current selections and placements are cleared and the selection results (including this selection) is submitted to the backend.
    - If selection limit has been reached (with previous selection - when autosubmit is disabled) 
    then all current selections and placements are cleared and only the new selection will be performed.
    ////
    */
    select: function (event, changeSelected, selectionLimit, autoSubmit) {
        // default paramater values
        if (selectionLimit === undefined) {
            selectionLimit = 1;
        }
        if (autoSubmit === undefined) {
            autoSubmit = false;
        }

        var evt = $.event.fix(event);
        if (evt.originalEvent === undefined) {
            var elementId = event[0].currentTarget.id;
        } else {
            var elementId = evt.originalEvent.currentTarget.id;
        }
        var tdElement = $(jq(elementId)); ///.getElementById(elementId);

        // keep state of what's been clicked
        // TODO: improvement: assign id's to table's AND td's if they don't have any
        var tableId = tdElement.closest("table").attr("id");
        var selected = this.getSelectedState(tableId)[elementId];

        if (this.getNumberCellsCurrentlyPlaced(tableId) > 0) {
            MXit.ClearAndRedraw(tableId);
        }

        if (selected) {
            // On unselect, return to original state;
            MXit.markCellUnselected(elementId);
            MXit.RedrawUnselectedCells(tableId);
        } else {
            // if the next selection will cause it to go over the limit
            if (this.getNumberCellsCurrentlySelected(tableId) + 1 > selectionLimit) {
                MXit.ClearAndRedraw(tableId);
            }

            MXit.markCellSelected(elementId, changeSelected)
            MXit.setStripActual(tdElement, changeSelected);
        }

        if (this.getNumberCellsCurrentlySelected(tableId) == selectionLimit) {
            if (autoSubmit) {

                MXit.submitTable(event, tableId);

                // clear all including newest one
                MXit.markCellUnselected(elementId);

                MXit.ClearAndRedraw(tableId);
            }
        }
    },

    GetColIndexOfCell: function (tdId) {
        return $(jq(tdId)).getNonColSpanIndex();
    },

    /* GetTdFromRowCol: function(tableId, row, col) {
    var rows = $('#' + tableId + ' table > tbody > tr');
    var row = rows[row];
    var table = document.getElementById(tableId);
    var row = table.rows[row];
    return row.cells[col];
    },*/

    GetRowIndexOfCell: function (tdId) {
        return $(jq(tdId)).closest('tr').prevAll('tr').length;
    },

    ClearAndRedraw: function (tableId) {
        MXit.SelectionsClear(tableId);
        MXit.PlacementsClear(tableId);
        MXit.RedrawUnselectedCells(tableId);
        MXit.RedrawUnplacedCells(tableId);
    },

    getNumberCellsCurrentlySelected: function (tableId) {
        var count = this.numberCellsCurrentlySelected[tableId];
        if (count == undefined) {
            count = 0;
            this.numberCellsCurrentlySelected[tableId] = count;
        }

        return count;
    },

    getNumberCellsCurrentlyPlaced: function (tableId) {
        var count = this.numberCellsCurrentlyPlaced[tableId];
        if (count == undefined) {
            count = 0;
            this.numberCellsCurrentlyPlaced[tableId] = count;
        }

        return count;
    },

    getCurrentSelectedCellIds: function (tableId) {
        var list = this.currentSelectedCellIds[tableId];
        if (list == undefined) {
            list = [];
            this.currentSelectedCellIds[tableId] = list;
        }

        return list;
    },

    getCurrentSelectedCellFramesList: function (tableId) {
        var list = this.currentSelectedCellFramesList[tableId];
        if (list == undefined) {
            list = [];
            this.currentSelectedCellFramesList[tableId] = list;
        }

        return list;
    },

    getTableState: function (tableId) {
        var list = this.tableState[tableId];
        if (list == undefined) {
            list = {};
            this.tableState[tableId] = list;
        }

        return list;
    },

    getCurrentPlacedCellIds: function (tableId) {
        var list = this.currentPlacedCellIds[tableId];
        if (list == undefined) {
            list = [];
            this.currentPlacedCellIds[tableId] = list;
        }

        return list;
    },


    getSelectedState: function (tableId) {
        var list = this.selectedState[tableId];
        if (list == undefined) {
            list = {};
            this.selectedState[tableId] = list;
        }

        return list;
    },

    getPlacedState: function (tableId) {
        var list = this.placedState[tableId];
        if (list == undefined) {
            list = {};
            this.placedState[tableId] = list;
        }

        return list;
    },

    RedrawUnselectedCells: function (tableId) {
        var table = this.getSelectedState(tableId);
        $.each(table, function (selectedId, isSelected) {
            if (!isSelected) {
                MXit.resetCell($(jq(selectedId))); ///document.getElementById(selectedId));
            }
        });
    },

    RedrawUnplacedCells: function (tableId) {
        var placedTable = this.getPlacedState(tableId);
        for (var placedId in placedTable) {
            var placed = placedTable[placedId];
            if (!placed) {
                this.resetCell($(jq(placedId))); /// document.getElementById(placedId));
            }
        }
    },

    SelectionsClear: function (tableId) {
        var list = this.getCurrentSelectedCellIds(tableId);
        for (var i = 0; i < list.length; i++) {
            this.markCellUnselected(list[i]);
        }
    },

    PlacementsClear: function (tableId) {
        var list = this.getCurrentPlacedCellIds(tableId);
        for (var i = 0; i < list.length; i++) {
            this.markCellUnplaced(list[i]);
        }
    },


    markCellUnselected: function (elementId) {
        var tableId = $(jq(elementId)).closest("table").attr("id"); /// this.GetCellParentTable(document.getElementById(elementId)).id;
        this.getSelectedState(tableId)[elementId] = false;
        this.numberCellsCurrentlySelected[tableId] = this.getNumberCellsCurrentlySelected(tableId) - 1;

        // removed the id from the selected list, preserving order
        var cnt = 0;
        var list = this.getCurrentSelectedCellIds(tableId);
        for (var i = 0; i < list.length; i++) {
            if (list[i] == elementId) {
                list.splice(i, 1);
                break;
            }
            cnt++;
        }
        // remove the cell frames at the position too
        this.getCurrentSelectedCellFramesList(tableId).splice(cnt, 1);
    },

    markCellUnplaced: function (elementId) {
        var tableId = $(jq(elementId)).closest("table").attr("id");
        this.getPlacedState(tableId)[elementId] = false;
        this.numberCellsCurrentlyPlaced[tableId] = this.getNumberCellsCurrentlyPlaced(tableId) - 1;

        // removed the id from the selected list, preserving order
        var cnt = 0;
        var placedCellIds = this.getCurrentPlacedCellIds(tableId);
        for (var i = 0; i < placedCellIds.length; i++) {
            if (placedCellIds[i] == elementId) {
                placedCellIds.splice(i, 1);
                break;
            }
            cnt++;
        }
        // remove the cell frames at the position too
        //this.currentSelectedCellFramesList.splice(cnt, 1);
    },

    // mark cell as selected and add it in order to the list
    markCellSelected: function (elementId, changeSelected) {
        var tableId = $(jq(elementId)).closest("table").attr("id");
        this.getSelectedState(tableId)[elementId] = true;
        this.numberCellsCurrentlySelected[tableId] = this.getNumberCellsCurrentlySelected(tableId) + 1;

        this.getCurrentSelectedCellIds(tableId).push(elementId);
        this.getCurrentSelectedCellFramesList(tableId).push(changeSelected);
    },

    // mark cell as placed and add it in order to the list
    markCellPlaced: function (elementId) {
        var tableId = $(jq(elementId)).closest("table").attr("id");
        this.getPlacedState(tableId)[elementId] = true;
        this.numberCellsCurrentlyPlaced[tableId] = this.getNumberCellsCurrentlyPlaced(tableId) + 1;

        this.getCurrentPlacedCellIds(tableId).push(elementId);
        //this.currentSelectedCellFrames.push(changeSelected);
    },

    /*    setStripToCurrentlySelectedCell: function(tableId, changeSelected) {
    var selectionTdElement = document.getElementById(this.GetLastSelectedCellId(tableId));
    MXit.setStrip(selectionTdElement, changeSelected);
    },*/

    // get the last selected cell
    GetLastSelectedCellId: function (tableId) {
        var list = this.getCurrentSelectedCellIds(tableId);
        return list[list.length - 1];
    },

    GetLastPlacedCellId: function (tableId) {
        var placedCellIds = this.getCurrentPlacedCellIds(tableId);
        return placedCellIds[placedCellIds.length - 1];
    },

    /* 
    User clicks on placeable cell
    If a placement has already been made on this cell, it is ignored.
    If there is already a selection, then the changeSelected set of images are applied to the selected cell 
    and the changePlaced set of images are applied to the newly placed cell.
    If there is no selection, but there is a set of default selection images, 
    then the changePlaced set of images are applied to the newly placed cell, 
    where the current selection frame (.s) becomes the default selection images (see ds).
    If placement limit has been reached (with this placement) and autosubmit is enabled, then all current selections and placements are cleared and the selection and placement results (including this placement) is submitted to the backend.
    If placement limit has been reached (with previous placement - when autosubmit is disabled) then all current selections and placements are cleared and not further action is performed.
    */
    place: function (event, changeSelected, changePlaced, selectionLimit, autoSubmit) {
        // default paramater values
        if (selectionLimit === undefined) {
            selectionLimit = 1;
        }
        if (autoSubmit === undefined) {
            autoSubmit = true;
        }

        var evt = $.event.fix(event);
        if (evt.originalEvent === undefined) {
            var elementId = event[0].currentTarget.id;
        } else {
            var elementId = evt.originalEvent.currentTarget.id;
        }

        var tdElement = $(jq(elementId));
        //var TABLE_CURRENT = document.getElementById(tableName);
        var tableId = tdElement.closest("table").attr("id");
        // keep state of what's been placed
        var placed = this.getPlacedState(tableId)[elementId];
        if (!placed)
            this.getPlacedState(tableId)[elementId] = !placed;

        //if (this.getNumberCellsCurrentlySelected(tableId) > 0) {
        //this.setStrip(tdElement, changeSelected);
        //}
        var numberCellsCurrentlySelected = this.getNumberCellsCurrentlySelected(tableId);
        var defaultFrames = MXit.tableDefaultImages[tableId];
        // If there's something selected OR some default image
        if ((defaultFrames !== undefined) || (numberCellsCurrentlySelected > 0)) {
            //if ((numberCellsCurrentlySelected > 0 && !placed)) {
            this.setStripActual(tdElement, changePlaced);
            // TODO fix place place}
        }

        if (placed) {
            // On unselect, return to original state;
            //this.numberCellsCurrentlyPlaced[table.id] = this.getNumberCellsCurrentlyPlaced(table.id) - 1;

            //if (this.getNumberCellsCurrentlySelected(table.id) > 0) {
            //  this.markCellUnselected(this.GetLastSelectedCellId());
            //}
        } else {
            if (this.getNumberCellsCurrentlyPlaced(tableId) + 1 > selectionLimit) {
                // if this next placement will cause to go over limit
                this.ClearAndRedraw(tableId);
            }

            this.markCellPlaced(elementId);
        }
        // If placement limit has been reached (with this placement) and autosubmit is enabled, 
        //then all current selections and placements are cleared and the selection and placement results (including this placement)
        //is submitted to the backend.

        //If placement limit has been reached (with previous placement - when autosubmit is disabled) then all current selections and placements are cleared and not further action is performed.

        if (autoSubmit && this.getNumberCellsCurrentlyPlaced(tableId) == selectionLimit) {
            this.submitTable(event, tableId);

            this.ClearAndRedraw(tableId);
        }
    },
    /*{
    "Selected":[{"Col":0,"Row":1}],
    "Placed":[{"Col":1,"Row":2}],
    "StructuredResponse":true,
    "Name":"chessboard",
    "Value":"sel,0.1;place,1.2",
    "ElementType":13,
    "ErrCode":0,
    "ErrMsg":"Success",
    "Contacts":null
    }
    */
    submitTable: function (event, tableId) {
        var eventTarget = $.event.fix(event);
        if (tableId === undefined) {
            tableId = eventTarget.originalEvent.currentTarget.id;
        }
        var obj = new Object();
        // make a list of CellCoords
        obj.Selected = [];
        var selectedCellsState = this.getSelectedState(tableId);
        for (var selectedId in selectedCellsState) {
            var selected = selectedCellsState[selectedId];
            if (selected) {
                var CellCoord = new Object();
                CellCoord.Row = MXit.GetRowIndexOfCell(selectedId);
                CellCoord.Col = MXit.GetColIndexOfCell(selectedId);
                obj.Selected.push(CellCoord);
            }
        }
        //
        obj.Placed = [];
        var placedCellsState = this.getPlacedState(tableId);
        for (var placedId in placedCellsState) {
            var placed = placedCellsState[placedId];
            if (placed) {
                var CellCoord = new Object();
                CellCoord.Row = MXit.GetRowIndexOfCell(placedId);
                CellCoord.Col = MXit.GetColIndexOfCell(placedId);
                obj.Placed.push(CellCoord);
            }
        }

        obj.Name = tableId;
        obj.ErrCode = 0;
        obj.ErrMsg = "Success";
        obj.Contacts = null;
        obj.ElementType = 13;
        obj.ContactMXitId = $(jq(tableId)).attr("data-contact-mxit-id");
        isFinishLoading = false;
        var urlX = $(jq(tableId)).attr("data-submit-url");
        var bodyContent = $.ajax({
            url: urlX, // "Post.aspx",
            global: false,
            type: "POST",
            async: true,
            data: (JSON.stringify(obj)),
            //dataType: "html",
            dataFilter: function (data, type) {

            },
            success: function (data, successMsg, xmlhttpreq) {
                if (data === undefined) {
                    data = xmlhttpreq.responseText;
                }
                var doc = $(data);

                // Check for any new image strip objects sent through and add them if they don't exist..
                var objects = doc.find("object");
                if (objects.length !== 0) {
                    objects.each(function (objIndex) {
                        var obj = $(this);
                        // find which ones don't already exists on page
                        if ($('#' + obj.attr('id')).length <= 0) {
                            $('body', obj.ownerDocument).append(obj);
                        }
                    });
                }
                var table = doc.find("table[title*=update]");
                if (table.length !== 0) {
                    // have an update table
                    table.find("td").each(function (index) {
                        // replace current cell in $ with new one from doc received
                        var newCell = $(this);
                        var currentCellWithId = $(jq(newCell.attr("id")));
                        currentCellWithId.replaceWith(newCell);
                        MXit.resetCell(newCell);
                    });
                    //for (var i = 0; i < cells.length; i++) {
                    //var cell = cells[i];
                    //var currentCellWithId = $("#" + cell.id);
                    //currentCellWithId.replaceWith(cell);
                    // redraw changed cells
                    //MXit.resetCell($(this));
                    //}
                }

            },
            beforeSend: function (o) {
                // begin animating...
                var progressBar = $("#MXitProgressBar");
                if (progressBar.length === 0) {
                    $("body").append("<div id=\"MXitProgressBar\" style=\"visible: false; background-color:#FF9988;width:10%;border: 1px solid red;\">Loading</div>");
                    progressBar = $("#MXitProgressBar");
                }

                progressBar.show().animate({
                    width: "100%"
                }, 10000, function () {
                    progressBar.show().animate({
                        width: "10%"
                    }, 5000);
                });
            },
            //error: function(o, a, b) { alert('error' + o + ','+a+','+b); },
            //dataFilter: function(o, b) { alert('dataFilter' + o); },
            complete: function (o, b) {
                $("#MXitProgressBar").stop(true, true).stop(true, true).hide();
            }
        }
        ).responseXml;
    },

    /// If this strip has a current reference (.s) and no selections are made, it will use the table default selection if available
    setStripActual: function (tdElement, stripItems, reset) {
        if (reset === undefined)
            reset = false;
        else if (reset)
            tdElement.empty();

        var tableId = tdElement.closest("table").attr("id"); ///this.GetCellParentTable(tdElement).id;
        var selectionTdElement = $(jq(this.GetLastSelectedCellId(tableId)));
        if (selectionTdElement.length > 0) {
            var tableStateForElem = this.getTableState(tableId)[selectionTdElement.attr("id")];
        }

        if (!($.isArray(stripItems))) {
            stripItems = $.makeArray(stripItems);
        }

        var tdElementDiv = $('<div />');
        tdElementDiv.css('position', 'relative');
        var numStripItems = stripItems.length;
        for (var i = 0; i < numStripItems; i++) {
            var stripItem = stripItems[i];
            var res = extractImageStripNameAndIndex(stripItem);
            var imageStripName = res.name;
            var imageStripIndex = res.index;
            var clearFrame = false;

            if (imageStripIndex == 'c') {
                // clear frame
                clearFrame = true;
                // restore to default
                MXit.resetCell(tdElement);
                return;
            } else if (imageStripIndex == 's') {
                // the frame from the cell that is currently selected
                if (this.getNumberCellsCurrentlySelected(tableId) > 0) {
                    if (tableStateForElem === undefined) {
                        var frames = [];
                    } else {
                        var frames = tableStateForElem['frames'];
                    }
                } else {
                    var frames = MXit.tableDefaultImages[tableId];
                    if (frames === undefined) {
                        // Nothing can do here
                        console.log('No selected cell and no default image strip: ' + res + ', frames=' + frames);
                        return;
                    }
                }
                var len = frames.length;
                for (var j = 0; j < len; j++) {
                    var frame = frames[j];
                    // find the strip name with the same name as one we want to select
                    if (stringStartsWith(frame, imageStripName)) {
                        // prevent infinite loop
                        if (!stringEndsWith(frame, 's')) {
                            // set the strip on the cell currently working with
                            MXit.setStripActual(tdElement, frame); // e.g. bg.2
                            return;
                        }
                    }
                }

                console.log('Havent found selected image strip: strip=' + res.name + '.' + res.index + ', frames=' + frames);
                return;
            }

            var imageStripObject = $(jq(imageStripName));

            var imgDivId = MXit.ID_OF_DIV_FOR_IMG_STRIP + tdElement.attr("id") + (i + 1);
            var imgId = imgDivId + stripItem;

            var prevWrapperDiv = $(jq(imgDivId));
            // create image element
            var imgEl = $('<img />');
            imgEl.attr('src', imageStripObject.attr('codebase'));
            imgEl.attr("id", imgId);
            var prevImgEl = $(jq(imgId));
            if (prevImgEl.length > 0) {
                prevImgEl.replaceWith(imgEl);
                var wrapperDiv = prevWrapperDiv;
            } else {
                // create div container to position the image in the cell
                if (prevWrapperDiv.length <= 0) {
                    var wrapperDiv = $('<div />');
                    wrapperDiv.css('position', 'absolute');
                    wrapperDiv.css('overflow', 'hidden');
                    wrapperDiv.attr('id', imgDivId);
                    wrapperDiv.attr('name', stripItem);
                    wrapperDiv.css('top', '0px');
                    wrapperDiv.css('left', '0px');
                    //imgDiv.id = imgDivId;
                    //imgDiv.name = stripItem;
                    /// imgDiv.css('position', 'absolute');
                    //imgDiv.css('overflow', 'hidden');
                    //imgDiv.css('top', '0px');
                    // imgDiv.css('left', '0px');
                } else {
                    var wrapperDiv = prevWrapperDiv;
                    ///imgDiv.css('position', 'absolute');
                }

                // add image element as the child of the image div element
                ///imgDiv.append(imgEl);
                // check if it doesn't already exist
                if (prevWrapperDiv.length > 0 && numStripItems <= 1) {
                    prevWrapperDiv.remove();
                    tdElement.empty();
                }
            }

            // wrapper Div contains the img element
            wrapperDiv.append(imgEl);
            // Add the wrapper div to the cell root div element
            tdElementDiv.append(wrapperDiv);

            MXit.setImageStyle(tdElement, tdElementDiv, wrapperDiv, imageStripObject, imageStripIndex, imgEl);

            //if (tdElementDiv.children().length > 0) {
            // add it afterwards and not before just to save redrawing time
            tdElement.prepend(tdElementDiv);
            //}
            if (i === numStripItems - 1) {
                var state = this.getTableState(tableId)[tdElement.attr("id")];
                if (state) {
                    state['frames'] = [];
                }
            }

            this.AddFrameToTableState(tdElement, stripItem);
        }
    },

    AddFrameToTableState: function (tdElement, stripItem) {
        var tableId = tdElement.closest("table").attr("id"); //this.GetCellParentTable(tdElement).id;
        var tdElementId = tdElement.attr("id");
        var currentTableState = this.getTableState(tableId);
        var state = currentTableState[tdElementId];
        if (state == undefined) {
            state = {};
            currentTableState[tdElementId] = state;
        }
        var framesList = state['frames'];
        if (framesList == undefined) {
            framesList = [];
            state['frames'] = framesList;
        }

        // don't add duplicates
        if (!$.inArray(stripItem, framesList)) {
            framesList.push(stripItem);
        }
    },

    loadStrips: function () {
        $('object').each(function (index) {
            var object = $(this);
            var stripName = object.attr("name");
            var params = object.find("param");
            var defaultImageIndex;
            // get defaultimageindex first
            for (var jj = 0; jj < params.length; jj++) {
                var name = params[jj].getAttribute("name");
                if (name == "defaultImageIndexForTable") {
                    defaultImageIndex = params[jj].value;
                }
            }
            for (var jj = 0; jj < params.length; jj++) {
                var name = params[jj].getAttribute("name");
                if (name == "defaultImageForTable") {
                    var tablesList = params[jj].value;

                    var tables = tablesList.split(",");
                    for (var k = 0; k < tables.length; k++) {
                        var table = tables[k];
                        var prev = MXit.tableDefaultImages[table];
                        if (prev === undefined) {
                            MXit.tableDefaultImages[table] = stripName + '.' + defaultImageIndex;
                        } else {
                            MXit.tableDefaultImages[table] = prev + ',' + stripName + '.' + defaultImageIndex;
                        }
                    }
                }
            }
        });
    },

    resetCell: function (tdElement) {
        // var tableId = this.GetCellParentTable(tdElement).id;
        // clear all state
        // this.getTableState(tableId)[tdElement.id]['frames'] = [];

        var sts = tdElement.attr("data-mxit-init"); ///.getAttribute('onload');
        if (sts) {
            var pos = sts.indexOf('setStrip');
            if (pos > -1) {
                // "['strip.2', 'bg.2']"
                var params = sts.substring(pos + 9, sts.indexOf(')', pos + 9));
                var paramsArray = eval(params);
                MXit.setStripActual(tdElement, paramsArray, true);
            }
        }

        MXit.setCursor(tdElement);
    },

    setCursor: function (tdElement) {
        var on = tdElement.attr('onclick');
        if (on) {
            tdElement.css('cursor', 'pointer');
            /* one day... tdElement.mouseover(function () { 
            $(this).fade
            });*/
        }
    },

    start: function (e) {
        $("table").each(function (index) {
            var table = $(this);
            table.attr('border', 0);
            table.attr('rules', 'none');
        });

        MXit.loadStrips();

        $("td").each(function (index) {
            MXit.resetCell($(this));
        });
    }
}

function extractImageStripNameAndIndex(strip) {
    var imageStrip = strip.split(".");
    var imageStripName = imageStrip[0];
    var imageStripIndex = imageStrip[1];
    return { name: imageStripName, index: imageStripIndex };
}

function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, args);
}

function jq(myid) {
    if (!myid) {
        return myid;
    }
    return '#' + myid.replace(/(:|\.)/g, '\\$1');
}

function stringStartsWith(string, search) {
    return !string.indexOf(search);
}

function stringEndsWith(string, search) {
    //a.s
    var lastIndex = string.lastIndexOf(search); // 2
    return (lastIndex != -1) && (lastIndex + search.length == string.length); // 2 + 1 = 3

}

