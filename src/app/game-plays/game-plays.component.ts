import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-plays',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './game-plays.component.html',
  styleUrl: './game-plays.component.css',
})
export class GamePlaysComponent {
  gameplays = [
    '排行榜',
    '签到',
    '节日礼券',
    '跨服',
    '天降宝箱',
    '道具',
    '入口/红点',
    '界面',
    '动效',
    '性能测试',
    '竞猜',
  ];
  choosedGamplays = [];
  presets = [
    {
      name: '全部',
      preChoose: [
        '排行榜',
        '签到',
        '节日礼券',
        '跨服',
        '天降宝箱',
        '道具',
        '入口/红点',
        '界面',
        '动效',
        '性能测试',
        '竞猜',
      ],
    },
    { name: '重置', preChoose: [] },
    { name: '节日活动', preChoose: ['天降宝箱', '界面'] },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.choosedGamplays);
  }

  onPreset(presetname: string) {
    this.presets.forEach((element) => {
      if (element.name == presetname) {
        this.reset()
        this.choosedGamplays = element.preChoose;
        let choosed = element.preChoose;

        this.gameplays = this.gameplays.filter(
          (item) => !choosed.includes(item)
        );
      }
    });
  }

  reset(){
    this.gameplays = [
      '排行榜',
      '签到',
      '节日礼券',
      '跨服',
      '天降宝箱',
      '道具',
      '入口/红点',
      '界面',
      '动效',
      '性能测试',
      '竞猜',
    ];
    this.choosedGamplays = [];
  }
}
