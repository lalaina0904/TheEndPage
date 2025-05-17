export default interface Message {
  sender: 'user' | 'ai';
  content: string;
}