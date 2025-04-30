import React, { useState } from "react";
import { Card, CardBody, Button, Input, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Education {
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface EducationSectionProps {
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
}

const EducationSection: React.FC<EducationSectionProps> = ({ educations, setEducations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState<Education>({
    school: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  const handleAddEducation = () => {
    setEducations([newEducation, ...educations]);
    setNewEducation({
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    });
    setIsAdding(false);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCurrentChange = (checked: boolean) => {
    setNewEducation((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Education</h3>
          {!isAdding && (
            <Button color="primary" onPress={() => setIsAdding(true)} startContent={<Icon icon="lucide:plus" />}>
              Add Education
            </Button>
          )}
        </div>

        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Add New Education</h4>

            <Input
              label="School/University"
              placeholder="School or university name"
              value={newEducation.school}
              onValueChange={(value) => setNewEducation((prev) => ({ ...prev, school: value }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                placeholder="e.g., Bachelor of Science"
                value={newEducation.degree}
                onValueChange={(value) => setNewEducation((prev) => ({ ...prev, degree: value }))}
              />
              <Input
                label="Field of Study"
                placeholder="e.g., Computer Science"
                value={newEducation.field}
                onValueChange={(value) => setNewEducation((prev) => ({ ...prev, field: value }))}
              />
            </div>

            <Input
              label="Location"
              placeholder="City, State, Country"
              value={newEducation.location}
              onValueChange={(value) => setNewEducation((prev) => ({ ...prev, location: value }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                placeholder="YYYY-MM"
                type="month"
                value={newEducation.startDate}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))}
              />
              <div className="flex flex-col">
                <Input
                  label="End Date"
                  placeholder="YYYY-MM"
                  type="month"
                  isDisabled={newEducation.current}
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))}
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEducation.current}
                    onChange={(e) => handleCurrentChange(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">I'm currently studying here</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="flat" onPress={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleAddEducation}
                isDisabled={!newEducation.school || !newEducation.degree || !newEducation.startDate}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {educations.map((edu, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{edu.school}</h4>
                  <p className="text-default-600">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-default-500">
                    {edu.location} • {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{" "}
                    {edu.current
                      ? "Present"
                      : new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  color="danger"
                  onPress={() => handleRemoveEducation(index)}
                >
                  <Icon icon="lucide:trash-2" />
                </Button>
              </div>
              {index < educations.length - 1 && <Divider className="mt-4" />}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default EducationSection;
