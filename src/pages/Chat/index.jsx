import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./style.css";
import io from "socket.io-client";
import { PORT } from "../../constants/ws";
import USER_API from "../../api/user";
import CHAT_MESSENGER from "../../api/messenger";
import { SendOutlined } from "@ant-design/icons";

// const socket = io(`http://localhost:3000`);

ChatMessenger.propTypes = {};

function ChatMessenger(props) {
  const id_admin = "6259945d9972435c645c61bc";

  const [another, setAnother] = useState([]);
  const [id_user2, set_id_user2] = useState("");
  const [message, setMessage] = useState([]);
  const [load, setLoad] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const handler_id_user = (value) => {
    set_id_user2(value);
  };

  const onChangeText = (e) => {
    setTextMessage(e.target.value);
  };

  // Hàm này dùng để tìm ra những user khác với admin
  useEffect(() => {
    sessionStorage.setItem("name_user", "ADMIN");

    const fetchData = async () => {
      const response = await USER_API.getMuntipleUser();
      setAnother(response?.data);
    };
    fetchData();
  }, []);

  // Hàm này dùng để load dữ liệu message và nó sẽ chạy lại khi state id_user2 thay đổi
  // Tức là khi admin chọn người dùng mà admin muốn chat thì state id_user2 sẽ thay đổi
  // để gọi lại hàm này
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        user_id1: id_admin,
        user_id2: id_user2,
      };
      if (params.user_id2) {
        const response = await CHAT_MESSENGER.getMessenger(params);
        setMessage(response?.data?.content);
      }
    };

    fetchData();
  }, [id_user2]);

  // Đây là hàm lấy dữ liệu từ api dựa vào state load
  // Dùng để load lại tin nhắn khi có socket từ server gửi tới
  useEffect(() => {
    if (load) {
      const fetchData = async () => {
        const params = {
          user_id1: id_admin,
          user_id2: id_user2,
        };
        if (params.user_id2) {
          const response = await CHAT_MESSENGER.getMessenger(params);
          setMessage(response?.data?.content);
        }
      };

      fetchData();
      setLoad(false);
    }
  }, [load]);

  //Hàm này dùng để nhận socket từ server gửi lên
  useEffect(() => {
    //Nhận dữ liệu từ server gửi lên thông qua socket với key receive_message
    // socket.on("receive_message", (data) => {
    //   Sau đó nó sẽ setLoad gọi lại hàm useEffect lấy lại dữ liệu
    //   setLoad(true);
    // });
  }, []);

  const handlerSend = () => {
    if (!id_user2) {
      return;
    }

    //Khi gửi tin nhắn thì nó sẽ lấy id của cả 2 người
    //Với cái key category có value là send
    //Vì là gửi tin nhắn
    const data = {
      user_id1: id_admin,
      user_id2: id_user2,
      id: Math.random().toString(),
      message: textMessage,
      name: sessionStorage.getItem("name_user") || "Name test",
      category: "send",
    };

    //Sau đó nó emit dữ liệu lên server bằng socket với key send_message và value data
    // socket.emit("send_message", data);

    //Tiếp theo nó sẽ postdata lên api đưa dữ liệu vào database
    const postData = async () => {
      const response = await CHAT_MESSENGER.createMessenger(data);
      console.log(response);

      //Sau đó gọi hàm setLoad để useEffect lấy lại dữ liệu sau khi update
      setLoad(true);
    };

    postData();
    setTextMessage("");
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row no-gutters">
                <div className="col-lg-3 col-xl-2 border-right">
                  <div className="card-body border-bottom">
                    <form>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search Contact"
                      />
                    </form>
                  </div>
                  <div
                    className="scrollable position-relative"
                    style={{ height: "calc(100vh - 111px)" }}
                  >
                    <ul className="mailbox list-style-none">
                      <li>
                        <div className="message-center">
                          {another &&
                            another.map((value) => (
                              <a
                                href
                                key={value._id}
                                onClick={() => {
                                  handler_id_user(value._id);
                                }}
                                className="message-item d-flex align-items-center border-bottom px-3 py-2 active_user"
                              >
                                <div className="user-img">
                                  {" "}
                                  <img
                                    src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                    alt="user"
                                    className="img-fluid rounded-circle"
                                    width="40px"
                                  />{" "}
                                  <span className="profile-status away float-right"></span>
                                </div>
                                <div className="w-75 d-inline-block v-middle pl-2">
                                  <h6 className="message-title mb-0 mt-1">
                                    {`${value.first_name} ${value.last_name}`}
                                  </h6>
                                  <span className="font-12 text-nowrap d-block text-muted text-truncate">
                                    Online
                                  </span>
                                  <span className="font-12 text-nowrap d-block text-muted">
                                    9:08AM
                                  </span>
                                </div>
                              </a>
                            ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9  col-xl-10">
                  <div
                    className="chat-box scrollable position-relative"
                    style={{ height: "calc(100vh - 111px)" }}
                  >
                    <ul className="chat-list list-style-none px-3 pt-3">
                      {message &&
                        message.map((value) =>
                          value.category === "send" ? (
                            <li
                              className="chat-item odd list-style-none mt-3"
                              key={value.id}
                            >
                              <div className="chat-content text-right d-inline-block pl-3">
                                <div className="box msg p-2 d-inline-block mb-1">
                                  You: {value.message}
                                </div>
                                <br />
                              </div>
                            </li>
                          ) : (
                            <li
                              className="chat-item list-style-none mt-3"
                              key={value.id}
                            >
                              <div className="chat-img d-inline-block">
                                <img
                                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                  alt="user"
                                  className="rounded-circle"
                                  width="45"
                                />
                              </div>
                              <div className="chat-content d-inline-block pl-3">
                                <h6 className="font-weight-medium">
                                  {value.name}
                                </h6>
                                <div className="msg p-2 d-inline-block mb-1">
                                  {value.message}
                                </div>
                              </div>
                              <div className="chat-time d-block font-10 mt-1 mr-0 mb-3"></div>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <div className="card-body border-top">
                    <div className="row">
                      <div className="col-9">
                        <div className="input-field mt-0 mb-0">
                          <input
                            id="textarea1"
                            placeholder="Type and enter"
                            className="form-control border-0"
                            type="text"
                            onChange={onChangeText}
                            value={textMessage}
                            style={{ border: "none", outline: "none" }}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <a
                          href
                          className="btn-circle btn-lg btn-cyan float-right text-white"
                          onClick={handlerSend}
                        >
                          {/* <i className="fas fa-paper-plane"></i>
                           */}
                          <SendOutlined
                            style={{ fontSize: 12, color: "green" }}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessenger;
