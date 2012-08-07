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
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;

namespace MXitMeApp
{
    public partial class Post : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Avatar.Attributes.Add("title", "mxit:table:update");
            Parts.Attributes.Add("title", "mxit:table:update");

            string postData = Request.Params[null];

            //Gaming gaming = new Gaming(parts, "Post.aspx"); 
            JavaScriptSerializer jss = new JavaScriptSerializer();
            TableReply reply = jss.Deserialize<TableReply>(postData);

            //parts.Visible = true;
            //parts.Attributes.Add("title", "mxit:table:update");

            if (reply.Selected.Count > 0)
            {
                CellCoord c = reply.Selected[0];
                Table prevParts = (Table)Session["partstable"];
                Table prevAvatar = (Table)Session["avatartable"];
                String id = prevParts.Rows[c.Row].Cells[c.Col].Attributes["data-mxit-init"];
                String prevav = prevAvatar.Rows[0].Cells[0].Attributes["data-mxit-init"];
                id = id.Substring(id.IndexOf("['")+2);
                id = id.Substring(0,id.IndexOf("']"));
                id = "B" + id;
                String tempid = id.Substring(0, id.IndexOf(".")+1);
                

                TableCell cell = prevAvatar.Rows[0].Cells[0];


                Gaming avatar = new Gaming(Avatar, "Post.aspx");
                avatar.AddRow();

                using (TableCell newTC = new TableCell())
                {
                    newTC.CopyBaseAttributes(cell);
                    newTC.ID = cell.ID;
                    newTC.Text = cell.Text;
                    foreach (string key in cell.Attributes.Keys)
                    {
                        newTC.Attributes.Add(key, cell.Attributes[key]);
                    }

                    foreach (string k in cell.Style.Keys)
                    {
                        newTC.Style.Add(k, cell.Style[k]);
                    }

                    avatar.CurrentRow.Cells.Add(newTC);
                }
                if (prevav.Contains(",'" + id + "'"))
                {
                    Avatar.Rows[0].Cells[0].Attributes["data-mxit-init"] = prevav.Replace(",'" + id + "'", "");
                }
                else if (prevav.Contains(",'" + tempid ))
                {
                    prevav = prevav.Remove(prevav.IndexOf(",'" + tempid),(",'" + tempid).Length+2);  //remove old item  and replace with new one
                    Avatar.Rows[0].Cells[0].Attributes["data-mxit-init"] = prevav.Insert(prevav.IndexOf(']'), ",'" + id + "'");                    
                }
                else
                {
                    Avatar.Rows[0].Cells[0].Attributes["data-mxit-init"] = prevav.Insert(prevav.IndexOf(']'), ",'" + id + "'");
                }
                Session["avatartable"] = Avatar;
                

                 
            }

        }
    }
}
