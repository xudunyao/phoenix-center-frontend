import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { SubMenu } = Menu;

const SideMenu = ({ menus, selectedKeys, defaultOpenKeys }) => {
  const navigate = useNavigate();
  const rootSubmenuKeys = menus.map(({ key }) => key);
  const [openKeys, setOpenKeys] = useState(['']);

  useEffect(() => {
    setOpenKeys(defaultOpenKeys);
  }, [defaultOpenKeys]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleMenuClick = ({ item }, menu) => {
    navigate(item.props.link, { state: { title: menu.title } });
  };

  const renderSubMenu = (list) => list.map((menu) => (menu.visible && (
    menu.children && menu.children.length && menu.children.find((m) => m.visible) ? (
      <SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
        {
          renderSubMenu(menu.children)
        }
      </SubMenu>
    ) : (
      <Menu.Item
        key={menu.key}
        icon={menu.icon}
        onClick={(props) => handleMenuClick(props, menu)}
        link={menu.link}
      >
        {menu.title}
      </Menu.Item>
    )
  )));

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={selectedKeys}
    >
      { renderSubMenu(menus) }
    </Menu>
  );
};

const MENU_SHAPE = (...args) => PropTypes.shape({
  title: PropTypes.string,
  key: PropTypes.string,
  icon: PropTypes.node,
  link: PropTypes.string,
  children: PropTypes.arrayOf(MENU_SHAPE),
}).apply(this, args);

SideMenu.propTypes = {
  menus: PropTypes.arrayOf(MENU_SHAPE),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
};

SideMenu.defaultProps = {
  menus: [],
  selectedKeys: [],
  defaultOpenKeys: [],
};

export default SideMenu;
