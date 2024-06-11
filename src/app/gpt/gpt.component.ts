import { Component } from '@angular/core';
import { GptService } from '../services/gpt.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  imports:[CommonModule],
  selector: 'app-gpt',
  templateUrl: './gpt.component.html',
  styleUrls: ['./gpt.component.css']
})
export class GPTComponent {
  gptResponse: any;
  chatResponse: string;
  constructor(private gptService: GptService) { }

  getEmbeddingResponse(prompt: string) {
    this.gptService.getEmbedding(prompt).subscribe(response => {
      this.gptResponse = response;
      console.log(response);
    }, error => {
      console.error(error);
    });
  }
  sendMessage(message: string) {
    this.gptService.sendMessage(message).subscribe(response => {
      this.chatResponse = response.choices[0].message.content;
      console.log(response);
    }, error => {
      console.error(error);
    });
  }
  
}
