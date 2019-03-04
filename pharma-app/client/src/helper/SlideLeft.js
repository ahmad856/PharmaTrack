import React, { Component } from 'react';
import { slide as SideBar } from 'react-burger-menu';

class SlideLeft extends Component{
    render() {
        return (
        <SideBar>
          <a className="menu-item" href="/">
            Home
          </a>

          <a className="menu-item" href="/laravel">
            Laravel
          </a>

          <a className="menu-item" href="/angular">
            Angular
          </a>

          <a className="menu-item" href="/react">
            React
          </a>

          <a className="menu-item" href="/vue">
            Vue
          </a>

          <a className="menu-item" href="/node">
            Node
          </a>
        </SideBar>
        );
    }
}

export default SlideLeft;
