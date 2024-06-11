import { Component, OnInit } from '@angular/core';
import { Workbook, Topic, Marker } from 'xmind';

@Component({
  selector: 'app-xmind-sdk',
  standalone: true,
  imports: [],
  templateUrl: './xmind-sdk.component.html',
  styleUrl: './xmind-sdk.component.css'
})

export class XmindSdkComponent implements OnInit {

  // topic.on() default: `central topic`
  ngOnInit(): void {
    const [workbook, marker] = [new Workbook(), new Marker()];
    const topic = new Topic({ sheet: workbook.createSheet('sheet title', 'Central Topic') });
    topic.add({ title: 'main topic 1' });
    topic
      .on(topic.cid(/*In default, the componentId is last element*/))

      // add subtopics under `main topic 1`
      .add({ title: 'subtopic 1' })
      .add({ title: 'subtopic 2' })

      // attach text note to `main topic 1`
      .note('This is a note attached on main topic 1')

      // attach a marker flag to `subtopic 1`
      .on(topic.cid('subtopic 1'))
      .marker(marker.week('fri'))

      // add a component of the summary that contains two sub topics
      .summary({ title: 'subtopic summary', edge: topic.cid('subtopic 2') })
  }
}
