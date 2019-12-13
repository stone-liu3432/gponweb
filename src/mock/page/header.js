import Mock from "@/mock";

Mock.mock("/userlogin?form=logout", "post", "@BASESUCCESS");

Mock.mock("/system_save", "get", "@BASESUCCESS");
