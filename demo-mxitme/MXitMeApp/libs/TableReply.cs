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
using MXit.Messaging.MessageElements.Replies;

/// <summary>
/// Summary description for TableReply
/// </summary>
public class TableReply : MessageReply
{
    public TableReply()
    {
    }

    /// <summary>
    /// A list of the coordinates of all the data cells in the table that have been
    /// selected by the user (in order of their selection)
    /// </summary>
    internal List<CellCoord> _Selected = new List<CellCoord>();
    public List<CellCoord> Selected
    {
        get { return _Selected; }
        set { _Selected = value; }
    }

    /// <summary>
    /// A list of the coordinates of all the data cells in the table where a place
    /// operation has been performed (in order of placement)
    /// </summary>
    internal List<CellCoord> _Placed = new List<CellCoord>();
    public List<CellCoord> Placed
    {
        get { return _Placed; }
        set { _Placed = value; }
    }

    /// <summary>
    /// Extract the individual coordinates (in order) that were place or selected
    /// </summary>
    /// <param name="parms"></param>
    /// <param name="coordinates"></param>
    private void ParseCoords(String[] parms, List<CellCoord> coordinates)
    {
        for (int j = 1; j < parms.Length; j++)
        {
            string[] coord = parms[j].Split('.');
            int col = int.Parse(coord[0]);
            int row = int.Parse(coord[1]);
            coordinates.Add(new CellCoord(col, row));
        }
    }

    public override void Parse()
    {
        // parse the value element
        // this is a submit message
        string[] parts = Value.Split(';');
        foreach (string part in parts)
        {
            try
            {
                string[] parms = part.Split(',');
                if (parms[0].Equals("sel"))
                {
                    ParseCoords(parms, _Selected);
                }
                if (parms[0].Equals("place"))
                {
                    ParseCoords(parms, _Placed);
                }
            }
            catch (Exception)
            {
                // Continue 
            }
        }
    }

    #region Constructor
    /// <summary>
    /// Instantiate this classed (and its variables) based on the values of another IReply 
    /// </summary>
    /// <param name="reply"></param>
    public TableReply(IReply reply)
        : base(reply)
    {
    }
    #endregion
}

