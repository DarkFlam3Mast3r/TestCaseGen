import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GptService {
  private apiUrl = 'https://api.gptsapi.net/v1'; // 替换为你的 GPT 接口URL
  private apiKey = 'sk-GZK6522780241857854b343f3abd677899a1399f204cay4j'; // 替换为你的 GPT API 密钥

  constructor(private http: HttpClient) { }

  getEmbedding(input: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
        input: input,
        model: 'text-embedding-ada-002',
        encoding_format: 'float'
      };

      return this.http.post<any>(this.apiUrl+'/embeddings', body, { headers: headers });
  }

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: message }]
    };

    return this.http.post<any>(`${this.apiUrl}/chat/completions`, body, { headers: headers });
  }
}
