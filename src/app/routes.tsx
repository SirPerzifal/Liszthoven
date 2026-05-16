import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Store from "./pages/Store";
import News from "./pages/News";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "lessons", Component: Lessons },
      { path: "lessons/:category", Component: Lessons },
      { path: "lessons/:category/:id", Component: LessonDetail },
      { path: "events", Component: Events },
      { path: "events/:category", Component: Events },
      { path: "events/:category/:id", Component: EventDetail },
      { path: "store", Component: Store },
      { path: "news", Component: News },
      { path: "news/:id", Component: ArticleDetail },
      { path: "contact", Component: Contact },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "*", Component: NotFound },
    ],
  },
]);
