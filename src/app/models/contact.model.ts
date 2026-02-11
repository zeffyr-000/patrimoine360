export interface Advisor {
  name: string;
  title: string;
  phone: string;
  email: string;
  availability: string;
}

export interface Agency {
  name: string;
  address: string;
  hours: string;
}

export interface ContactData {
  advisor: Advisor;
  agency: Agency;
}
