export class Question{
    constructor(
        public index:number,
        public context:string,
        public choices:string[],
        public answer?:string
    ){
    }

}