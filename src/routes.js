import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Contact from "layouts/contact";
import GetTouch from "layouts/gettouch";
import Resume from "layouts/resume";
import Icon from "@mui/material/Icon";
import Clients from "layouts/client";
import Experience from "layouts/experiance";
import Blog from "layouts/blog";

// @mui icons

const routes = [
  {
    type: "collapse",
    name: "Resume",
    key: "resume",
    icon: <Icon fontSize="small">Resume</Icon>,
    route: "/resume",
    component: <Resume />,
  },
  {
    type: "collapse",
    name: "Contact",
    key: "contact",
    icon: <Icon fontSize="small">Contact</Icon>,
    route: "/contact",
    component: <Contact />,
  },
  {
    type: "collapse",
    name: "Blog",
    key: "blog",
    icon: <Icon fontSize="small">Blog</Icon>,
    route: "/blog",
    component: <Blog />,
  },
  {
    type: "collapse",
    name: "gettouch",
    key: "get-touch",
    icon: <Icon fontSize="small">Get Touch</Icon>,
    route: "/get-touch",
    component: <GetTouch />,
  },
  {
    type: "collapse",
    name: "Testimonial",
    key: "testimonial",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/testimonial",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Technology",
    key: "technology",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/technology",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Client",
    key: "client",
    icon: <Icon fontSize="small">Clients</Icon>,
    route: "/client",
    component: <Clients />,
  },
  {
    type: "collapse",
    name: "Experiance",
    key: "experiance",
    icon: <Icon fontSize="small">Experiance</Icon>,
    route: "/experiance",
    component: <Experience />,
  },
];

export default routes;
