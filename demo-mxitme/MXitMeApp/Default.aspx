<!-- Software Copyright Notice

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

[List third party software used in code] -->
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="MXitMeApp._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    <meta name="mxit" content="full_screen,clear_on_new,show_progress,no_heading" />
    <script type="text/javascript" src="libs/game-api-current.js"></script>
</head>
<body>
    <object style="display: none" declare="declare" id="Bbackground" codebase="img/Bbackground.png">
        <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="0" />
    </object>
     <object style="display: none" declare="declare" id="Bman" codebase="img/Boutline_character.png">
        <param name="width" value="96" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="1" />
    </object>
    <object style="display: none" declare="declare" id="Bhair" codebase="img/Bhair_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="2" />
    </object>
    <object style="display: none" declare="declare" id="Beyes" codebase="img/Beyes_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="2" />
    </object>
    <object style="display: none" declare="declare" id="Bmouth" codebase="img/Bmouth_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="3" />
    </object>
    <object style="display: none" declare="declare" id="Bpants" codebase="img/Bdungaree_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="5" />
    </object>
    <object style="display: none" declare="declare" id="Bshirt" codebase="img/Bshirt_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="4" />
    </object>
    <object style="display: none" declare="declare" id="Bshoes" codebase="img/Bshoes_character.png">
         <param name="width" value="192" />
        <param name="fw" value="96" />
        <param name="fh" value="96" />
        <param name="layer" value="6" />
    </object>
    
    <object style="display: none" declare="declare" id="background" codebase="img/background.png">
        <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="0" />
    </object>
    <object style="display: none" declare="declare" id="hair" codebase="img/hair_character.png">
        <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="2" />
    </object>
    <object style="display: none" declare="declare" id="eyes" codebase="img/eyes_character.png">
       <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="2" />
    </object>
    <object style="display: none" declare="declare" id="mouth" codebase="img/mouth_character.png">
        <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="3" />
    </object>
    <object style="display: none" declare="declare" id="pants" codebase="img/dungaree_character.png">
      <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="4" />
    </object>
    <object style="display: none" declare="declare" id="shirt" codebase="img/shirt_character.png">
        <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="4" />
    </object>
    <object style="display: none" declare="declare" id="shoes" codebase="img/shoes_character.png">
       <param name="width" value="60" />
        <param name="fw" value="30" />
        <param name="fh" value="30" />
        <param name="layer" value="4" />
    </object>
    
    <div>
        <asp:Table ID="Avatar" runat="server" GridLines="Both" BackColor="White">
        </asp:Table>
         <asp:Table ID="Parts" runat="server" GridLines="Both" BackColor="White">
        </asp:Table>
    
    </div>
    
</body>
</html>
