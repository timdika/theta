import { createStackNavigator } from "react-navigation-stack";

import Timeline from "../screens/Timeline"
import AddProject from "../screens/AddProject"
import ProjectView from "../screens/ProjectView";
import EditLog from "../screens/EditLogs"
import EditProject from "../screens/EditProject"


import { headerStyle } from "../styles/global"

const screens = {
    Timeline: {
        screen: Timeline,
        navigationOptions: { headerStyle: headerStyle }
    },
    AddProject: {
        screen: AddProject,
        navigationOptions: { headerStyle: headerStyle }
    },
    ProjectView: {
        screen: ProjectView,
        navigationOptions: { headerStyle: headerStyle }
    },
    EditLog: {
        screen: EditLog,
        navigationOptions: { headerStyle: headerStyle }
    },
    EditProject:{
        screen: EditProject,
        navigationOptions: { headerStyle: headerStyle }
    }
}

const TimelineStack = createStackNavigator(screens);

export default TimelineStack