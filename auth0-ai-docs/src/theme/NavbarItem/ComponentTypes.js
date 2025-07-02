import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import NavBarProfile from '@site/src/components/NavBarProfile';
import TenantSwitcher from '@site/src/components/TenantSwitcher';
import LoginButton from '@site/src/components/LoginButton';
import SignupButton from '@site/src/components/SignupButton';

export default {
  ...ComponentTypes,
  'custom-navBarProfile': NavBarProfile,
  'custom-tenantSwitcher': TenantSwitcher,
  'custom-loginButton': LoginButton,
  'custom-signupButton': SignupButton,
};
