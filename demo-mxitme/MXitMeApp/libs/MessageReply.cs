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
using MXit.Messaging.MessageElements;
using MXit.Messaging.MessageElements.Replies;

public class MessageReply
{
    private bool _StructuredResponse = true;
    public bool StructuredResponse
    {
        get { return _StructuredResponse; }
        set { _StructuredResponse = value; }
    }

    internal string _Name = null;
    public string Name
    {
        get { return _Name; }
        set { _Name = value; }
    }

    internal string _Value = null;
    public string Value
    {
        get { return _Value; }
        set { _Value = value; }
    }

    internal MessageElementType _Type = MessageElementType.None;
    public MessageElementType ElementType
    {
        get { return _Type; }
        set { _Type = value; }
    }

    internal int _ErrCode = 0;
    public int ErrCode
    {
        get { return _ErrCode; }
        set { _ErrCode = value; }
    }

    internal string _ErrMsg = "Success";
    public string ErrMsg
    {
        get { return _ErrMsg; }
        set { _ErrMsg = value; }
    }
    /*
    internal List<Contact> _Contacts = null;
    public List<Contact> Contacts
    {
        get
        {
            return _Contacts;
        }
        set { _Contacts = value; }
    }*/

    /// <summary>
    /// In the case where complex information is passed in the Value property, derive from this
    /// class and override the parse function to parse the value property and populate the relevant 
    /// </summary>
    public virtual void Parse()
    {
    }

    #region Constructor
    /// <summary>
    /// Empty constructor 
    /// </summary>
    public MessageReply()
    {
    }

    /// <summary>
    /// Instantiate this classed (and its variables) based on the values of another IReply 
    /// </summary>
    /// <param name="reply"></param>
    public MessageReply(IReply reply)
    {
        StructuredResponse = reply.StructuredResponse;
        _Name = reply.Name;
        _Value = reply.Value;
        _Type = reply.ElementType;
        _ErrCode = reply.ErrCode;
        _ErrMsg = reply.ErrMsg;
        //_Contacts = reply.Contacts;
    }
    #endregion
}
