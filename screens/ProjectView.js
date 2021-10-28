import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import g from "../styles/global"
import { secondsToShortTimeString, secondsToFormatedString, secondsToDateString } from '../js/timerfunctions';
import { v4 as uuidv4 } from 'uuid';
import { VictoryBar } from 'victory-native';

export default function ProjectView({ navigation, screenProps }) {
    let pid = navigation.getParam("projectViewPid")
    let projectIndex = screenProps.data.projects.findIndex((project) => project.pid === pid)
    let projectData = screenProps.data.projects[projectIndex]
    let projectName = projectData.name
    let lastDay = 0

    const addLog = () => {
        let copy = { ...screenProps.data }
        let start = Math.round(new Date().getTime() / 1000)
        copy.all_logs.push({
            project: projectName,
            pid: pid,
            lid: "L_" + uuidv4(),
            day: Math.ceil((start - screenProps.settings.start_of_day) / 60 / 60 / 24),
            start: start,
            duration: 600,
            end: start + 600,
            running: false,
        })
        screenProps.setData(copy)
    }

    const getBarData = () => {
        let relevant = []

        let boundaries = { end: screenProps.data.daily_logs[0].day, start: screenProps.data.daily_logs[screenProps.data.daily_logs.length - 1].day }
        let x = 0
        for (let i = boundaries.start; i <= boundaries.end; i++) {
            let sum = 0
            let index = screenProps.data.daily_logs.findIndex((day) => day.day === i)

            if (index >= 0) {
                let day = screenProps.data.daily_logs[index]
                let project = day.projects.find((project) => project.pid === pid)
                project.logs.forEach((log) => {
                    sum += log.duration
                })
            }
            x++
            relevant.push({ x: x, y: sum })
        }


        return relevant
    }




    return (

        <View style={g.body}>
            <VictoryBar
                data={
                    getBarData()
                }

            />
            <Text style={g.text}>{projectName}</Text>
            <Button title="Edit project" onPress={() => { navigation.navigate("EditProject", { edited_project: pid }) }} />
            <Button title="add" onPress={() => addLog()} />
            <ScrollView>
                {
                    projectData.logs.map((log) => {

                        let logs = null
                        let card = (

                            <TouchableOpacity onPress={() => { if (log.end) navigation.navigate("EditLog", { edited_log: log }) }} style={g.projectCard}>
                                <Text style={g.text}>{secondsToShortTimeString(log.start)} - {log.end ? secondsToShortTimeString(log.end) : "running"}</Text>
                                <Text style={g.text}>{secondsToFormatedString(log.duration)}</Text>
                            </TouchableOpacity>


                        )
                        if (lastDay !== log.day) {
                            logs = (
                                <View key={"projectViewLog" + log.start}>
                                    <Text style={g.dayTitle}>{secondsToDateString(log.start)}</Text>
                                    {card}
                                </View>
                            )
                        } else {
                            logs = (
                                <View key={"projectViewLog" + log.start}>
                                    {card}
                                </View>
                            )

                        }

                        lastDay = log.day

                        return (
                            logs
                        )


                    })
                }
            </ScrollView>
        </View >
    )
}

