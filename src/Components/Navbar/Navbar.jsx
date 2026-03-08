import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import { FaUserAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loggedMenuItems = ["Home", "Log Out"];
  const unLoggedMenuItems = ["Login", "Register"];
  const { userToken, setUserToken , userPhoto } = useContext(AuthContext);
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    navigate("/login");
  }

  return (
    <Navbar>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <p className="font-bold text-inherit">
          <Link to="/">SOCIAL-APP</Link>
        </p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent className="hidden sm:flex gap-4" justify="end">
          {userToken !== null && (
            <NavbarItem>
              <Link color="foreground" to="/">
                Home
              </Link>
            </NavbarItem>
          )}

          {userToken === null && (
            <>
              {" "}
              <NavbarItem>
                <Link color="foreground" to="/login">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" to="/register">
                  Register
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={userPhoto}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <Link to="/profile" className="w-full block">
                <div className="flex gap-2 items-center">
                  <FaUserAlt /> Profile
                </div>
              </Link>
            </DropdownItem>
            <DropdownItem key="settings">
              <Link to="/settings" className="w-full block">
                <div className="flex gap-2 items-center">
                  <FaGear /> Settings
                </div>
              </Link>
            </DropdownItem>
            {userToken !== null && (
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => {
                  logOut();
                }}
              >
                Log Out
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {userToken
          ? loggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  onClick={
                    item === "Log Out" &&
                    function () {
                      logOut();
                    }
                  }
                  className="w-full block"
                  color={
                    index === 2
                      ? "primary"
                      : index === loggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${item === "Log Out" ? "login" : item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))
          : unLoggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full block"
                  color={
                    index === 2
                      ? "primary"
                      : index === unLoggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
}
