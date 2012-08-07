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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace MXitMeApp
{
    public class Gaming
    {
        public TableRow CurrentRow;
        public readonly Table Table;
        private int _emptyCount;
        public Guid GameId;

        public Gaming(Table table, string postUrl)
        {
            Table = table;
            InitTable(postUrl);
        }

        public void AddRow()
        {
            CurrentRow = new TableRow();
            Table.Rows.Add(CurrentRow);
        }

        public void AddCell(string id, string body, string linkText, string url)
        {
            HyperLink link = new HyperLink
            {
                NavigateUrl = url,
                Text = linkText
            };
            AddCell(id, null, null, null, null, null, body, link);
        }
        public void AddCell(string id, string body)
        {
            AddCell(id, null, null, null, null, null, body);
        }

        public void AddCell(string id, string body, HyperLink link)
        {
            AddCell(id, null, null, null, null, null, body, link);
        }

        public void AddCell(string id, string align, string valign, string style, string onload,
                            string onclick, string body)
        {
            AddCell(id, align, valign, style, onload, onclick, body, null);
        }

        public void AddCell(string id, string align, string valign, string style, string onload,
                            string onclick, string body, HyperLink link)
        {
            TableCell cell = new TableCell();
            if (!string.IsNullOrEmpty(id))
                cell.ID = id;
            if (!string.IsNullOrEmpty(style))
                cell.Attributes.Add("style", style);
            if (!string.IsNullOrEmpty(onload))
                cell.Attributes.Add("data-mxit-init", onload);
            if (!string.IsNullOrEmpty(align))
                cell.Attributes.Add("align", align);
            if (!string.IsNullOrEmpty(valign))
                cell.Attributes.Add("valign", valign);
            if (!string.IsNullOrEmpty(onclick))
            {
                cell.Attributes.Add("onclick", onclick);
            }

            if (string.IsNullOrEmpty(body))
            {
                body = " &nbsp; ";
            }

            cell.Text = body;

            if (link != null)
            {
                cell.Controls.Add(link);
            }

            CurrentRow.Cells.Add(cell);
        }


        public void AddEmptyCell()
        {

            AddCell("empty" + (_emptyCount), null, null, null, null, null, null);
            _emptyCount++;
        }

        private void InitTable(string submitUrl)
        {
            const string tableStyle = "border-collapse: collapse; border-color: black;";
            this.Table.Attributes.Add("style", tableStyle);
            this.Table.Attributes.Add("title", "mxit:table:update");
            this.Table.Attributes.Add("data-submit-url", submitUrl);
        }
    }
}
