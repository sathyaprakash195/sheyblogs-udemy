import React from "react";
import MyBlogs from "./MyBlogs";
import Liked from "./Liked";
import Commented from "./Commented";
import Shared from "./Shared";
import Tabs from "../../components/Tabs";
import SharedToMe from "./ShareToMe";

function Profile() {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = [
    {
      name: "My Blogs",
      component: <MyBlogs />,
    },
    {
      name: "Blogs Shared To Me",
      component: <SharedToMe />,
    },
    {
      name: "Liked Blogs",
      component: <Liked />,
    },
    {
      name: "Commented Blogs",
      component: <Commented />,
    },
    {
      name: "Shared Blogs",
      component: <Shared />,
    },
  ];
  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Profile;
