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

namespace MXitMeApp
{
    public partial class _Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Create();
        }

        private void Create()
        {
            Gaming avatar = new Gaming(Avatar, "Post.aspx");
            Gaming parts = new Gaming(Parts, "Post.aspx");
            avatar.AddRow();
            avatar.AddCell("man_0", null, null, "border-width:1px", 
                "MXit.setStrip(['Bman.0'])",null, null);

            parts.AddRow();
            parts.AddCell("eyes_0", null, null, "border-width:1px",
                "MXit.setStrip(['eyes.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("eyes_1", null, null, "border-width:1px",
               "MXit.setStrip(['eyes.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("mouth_0", null, null, "border-width:1px",
                "MXit.setStrip(['mouth.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("mouth_1", null, null, "border-width:1px",
                "MXit.setStrip(['mouth.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("hair_0", null, null, "border-width:1px",
                "MXit.setStrip(['hair.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("hair_1", null, null, "border-width:1px",
                "MXit.setStrip(['hair.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("pants_0", null, null,"border-width:1px",
                "MXit.setStrip(['pants.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("pants_1", null, null, "border-width:1px",
                "MXit.setStrip(['pants.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("shirt_0", null, null, "border-width:1px",
                "MXit.setStrip(['shirt.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("shirt_1", null, null, "border-width:1px",
               "MXit.setStrip(['shirt.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("shoes_0", null, null, "border-width:1px",
                "MXit.setStrip(['shoes.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("shoes_1", null, null, "border-width:1px",
                "MXit.setStrip(['shoes.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            parts.AddCell("background_0", null, null, "border-width:1px",
                "MXit.setStrip(['background.0'])", "MXit.select(event,null,1,true)", null);
            parts.AddCell("background_1", null, null, "border-width:1px",
                "MXit.setStrip(['background.1'])", "MXit.select(event,null,1,true)", null);
            parts.AddRow();
            Session["partstable"] = Parts;
            Session["avatartable"] = Avatar;
            
        }
    }
}
