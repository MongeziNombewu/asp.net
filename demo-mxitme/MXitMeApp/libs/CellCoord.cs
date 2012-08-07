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
using System.Text;

using MXit.Messaging.MessageElements;

/// <summary>
/// Encapsulates the coordinates of a single data cell within a table
/// </summary>
public class CellCoord : ICellCoord
{

    public CellCoord()
    {
    }
    /// <summary>
    /// The column of the cell
    /// </summary>
    private int _Col;
    public int Col
    {
        get { return _Col; }
        set
        {
            _Col = value;
        }
    }

    /// <summary>
    /// The row of the cell
    /// </summary>
    private int _Row;
    public int Row
    {
        get { return _Row; }
        set
        {
            _Row = value;
        }
    }

    internal CellCoord(int col, int row)
    {
        Col = col;
        Row = row;
    }
}

