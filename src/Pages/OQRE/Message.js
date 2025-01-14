import React from 'react';

const Message = ({ message, messageType }) => {
  return (
    <div id="message" className={messageType}>
      {message}
    </div>
  );
};

export default Message;
