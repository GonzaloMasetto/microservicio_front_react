import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import CurrentCart from "../cart/CurrentCart";
import EditCart from "../cart/EditCart";
import NewArticle from "../catalog/NewArticle";
import SearchArticle from "../catalog/SearchArticle";
import SearchPicture from "../image/SearchPicture";
import UploadPicture from "../image/UploadPicture";
import Info from "../info/Info";
import OrdersList from "../orders/OrdersList";
import SearchOrder from "../orders/SearchOrder";
import LoggedInRoute from "../system/utils/LoggedInRoute";
import Login from "../users/Login";
import Password from "../users/Password";
import Register from "../users/Register";
import UserList from "../users/UserList";
import Welcome from "../welcome/Welcome";
import Perfil from "../perfil/Perfil";
import Sugerencia from "../perfil/Sugerencia"
import "./App.css";
import Menu from "./Menu";
import Toolbar from "./Toolbar";

export default function App() {
  return (
    <HashRouter>
      <table className="app_table">
        <thead>
          <tr className="app_toolbar">
            <td colSpan={2} >
              <Toolbar />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="app_menu">
              <Menu />
            </td>
            <td id="content" className="app_content">
              <Routes>
                <Route path="/" element={<Welcome/>} />
                <Route path="/perfil" element={<Perfil/>}/>  
                <Route path="/sugerencia" element={<Sugerencia/>}/>                
                <Route path="/login" element={<Login />} />
                <Route path="/newUser" element={<Register/>} />
                <Route path="/cart" element={<CurrentCart/>} />
                <Route path="/uploadPicture" element={<UploadPicture/>} />
                <Route path="/searchPicture" element={<SearchPicture/>} />
                <Route path="/showPicture/:imageId" element={<SearchPicture/>} />
                <Route path="/userList" element={<UserList/>} />
                <Route path="/newArticle" element={<NewArticle/>} />
                <Route path="/editArticle/:id" element={<NewArticle/>} />
                <Route path="/searchArticle" element={<SearchArticle/>} />
                <Route path="/editCart" element={<EditCart/>} />
                <Route path="/orders" element={<OrdersList/>} />
                <Route path="/searchOrder" element={<SearchOrder/>} />
                <Route path="/showOrder/:orderId" element={<SearchOrder/>} />
                <Route path="/info" element={<LoggedInRoute/>}>
                  <Route path="/info" element={<Info/>}/>
                </Route>
                <Route path="/password" element={<LoggedInRoute/>}>
                  <Route path="/password" element={<Password/>}/>
                </Route>
              </Routes>
            </td>
          </tr>
        </tbody>
      </table>
    </HashRouter >
  );
}
