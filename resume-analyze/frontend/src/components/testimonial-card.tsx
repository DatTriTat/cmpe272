import React from 'react';
import { Card, CardBody, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, company, image, quote }) => {
  return (
    <Card className="border-none">
      <CardBody className="gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={image} className="w-12 h-12" />
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-default-500">{role}, {company}</p>
          </div>
        </div>
        <div className="relative">
          <Icon 
            icon="lucide:quote" 
            className="absolute -top-1 -left-1 text-primary/20" 
            width={24} 
            height={24} 
          />
          <p className="pl-6 text-default-600 italic">"{quote}"</p>
        </div>
        <div className="flex text-warning">
          <Icon icon="lucide:star" />
          <Icon icon="lucide:star" />
          <Icon icon="lucide:star" />
          <Icon icon="lucide:star" />
          <Icon icon="lucide:star" />
        </div>
      </CardBody>
    </Card>
  );
};

export default TestimonialCard;