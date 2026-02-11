export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  riskProfile: 'prudent' | 'équilibré' | 'dynamique';
  bankerName: string;
  bankerEmail: string;
  clientSince: string;
}

export interface ClientData {
  client: ClientProfile;
}
