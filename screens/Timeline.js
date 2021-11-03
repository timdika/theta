import React, { useState } from 'react';
import { ScrollView, Button, Text, View, StyleSheet } from "react-native"
import g from '../styles/global'
import { DefaultText } from '../components/Components'
import ProjectSelection from "../components/ProjectSelection"
import TimelineDay from '../components/TimelineDay';
import { v4 as uuidv4 } from 'uuid';
import { copyObject } from '../js/functions';
import TimelineToday from "../components/TimelineToday"
import Navbar from '../components/Navbar';

export default function Timeline({ navigation, screenProps }) {


    const [projectSelectionOpen, setProjectSelectionOpen] = useState(false)



    const startProject = (pid) => {

        let alreadyRunning = screenProps.data.all_logs.filter((log) => log.running).length > 0

        if (!alreadyRunning) {


            let copy = { ...screenProps.data }

            let start = Math.round(new Date().getTime() / 1000)
            let name = copy.projects.filter((projectRef) => projectRef.pid === pid)[0].name

            copy.all_logs.push({
                project: name,
                pid: pid,
                lid: "L_" + uuidv4(),
                day: Math.floor((start - screenProps.settings.start_of_day) / 60 / 60 / 24),
                start: start,
                duration: 0,
                running: true
            })

            screenProps.setData(copy)
        }
    }

    const stopProject = () => {
        let dataCopy = { ...screenProps.data }

        let runningIndex = dataCopy.all_logs.findIndex((log) => log.running === true)

        let end = Math.round(new Date().getTime() / 1000)
        let start = dataCopy.all_logs[runningIndex].start
        let duration = end - start
        let project = dataCopy.all_logs[runningIndex].project
        let pid = dataCopy.all_logs[runningIndex].pid


        if (Math.floor((start - screenProps.settings.start_of_day) / 60 / 60 / 24) !== Math.floor((end - screenProps.settings.start_of_day) / 60 / 60 / 24)) {

            let current = start
            let day = Math.floor((start - screenProps.settings.start_of_day) / 60 / 60 / 24)
            let all = []


            while (current < end){
                all.push({start: current, end: day * 60 * 60 * 24 + 86399})
                current += 86400
                day ++
            }
            if (duration > 0){
                all.push({start: current, end: end, day: day})
            }

            all.forEach((log, i)=>{
                if(i === 0){
                    dataCopy.all_logs[runningIndex].running = false
                    dataCopy.all_logs[runningIndex].end = log.end
                    dataCopy.all_logs[runningIndex].duration = log.end - start
                }else{
                    dataCopy.all_logs.push({
                        project: project,
                        pid: pid,
                        lid: "L_" + uuidv4(),
                        day: log.day,
                        start: log.start,
                        duration: log.end - log.start,
                        running: false
                    })
                }
            })

        } else {
            dataCopy.all_logs[runningIndex].running = false
            dataCopy.all_logs[runningIndex].end = end
            dataCopy.all_logs[runningIndex].duration = end - start
        }

        screenProps.setData(dataCopy)

    }
    return (
        <View style={g.body}>
            <Navbar {...{ navigation }} location={"Timeline"} />
            {
                projectSelectionOpen && <ProjectSelection data={screenProps.data} {...{ navigation, setProjectSelectionOpen, startProject }} />
            }
            <View>
                <ScrollView
                    ref={ref => { this.timelineScrollView = ref }}
                    onContentSizeChange={() => this.timelineScrollView.scrollToEnd({ animated: true })}

                >
                    <View key="timelineTopMargin" style={s.timelineTopMargin}></View>
                    {
                        screenProps.data.reversed_daily_logs.map((dayData, i) => {
                            if (dayData.day !== Math.floor(Math.round(new Date().getTime() / 1000) / 60 / 60 / 24))
                                return <TimelineDay key={"dayContainer" + dayData.day} startProject={startProject} {...{ navigation, dayData }} />
                            else return
                        })
                    }
                    {
                        <TimelineToday setProjectSelectionOpen={setProjectSelectionOpen} goal={screenProps.settings.daily_goal} stopProject={stopProject} startProject={startProject} projects={screenProps.data.projects} {...{ navigation }} />
                    }
                </ScrollView>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    timelineTopMargin: {
        height: 100
    }
})
