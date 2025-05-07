import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Input, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Education {
  _id?: string;
  id?: string | number;
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

const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  setEducations,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    school: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [editEducation, setEditEducation] = useState<Education | null>(null);

  useEffect(() => {
    const patched = educations.map((edu) => ({
      ...edu,
      id: edu._id ?? edu.id ?? `${Date.now()}-${Math.random()}`,
    }));
    setEducations(patched);
  }, []);

  const handleAddEducation = () => {
    const newId = `${Date.now()}-${Math.random()}`;
    const entry = { ...newEducation, id: newId };
    setEducations((prev) => [entry, ...prev]);
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

  const handleRemoveEducation = (id: string | number) => {
    setEducations((prev) => prev.filter((edu) => String(edu.id) !== String(id)));
  };

  const handleEdit = (edu: Education) => {
    const cloned = {
      ...edu,
      id: edu._id ?? edu.id ?? `${Date.now()}-${Math.random()}`,
    };
    setEditEducation(cloned);
    setEditingId(cloned.id!);
    setIsAdding(false);
  };

  const handleUpdateEducation = () => {
    if (!editEducation || editingId === null) return;

    const updated = educations.map((edu) =>
      String(edu.id) === String(editingId) ? { ...editEducation } : edu
    );

    setEducations(updated);
    setEditEducation(null);
    setEditingId(null);
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
          {!isAdding && editingId === null && (
            <Button
              color="primary"
              onPress={() => setIsAdding(true)}
              startContent={<Icon icon="lucide:plus" />}
            >
              Add Education
            </Button>
          )}
        </div>

        {/* Add Education Form */}
        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Add New Education</h4>
            <Input
              label="School/University"
              value={newEducation.school}
              onValueChange={(val) =>
                setNewEducation((prev) => ({ ...prev, school: val }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                value={newEducation.degree}
                onValueChange={(val) =>
                  setNewEducation((prev) => ({ ...prev, degree: val }))
                }
              />
              <Input
                label="Field of Study"
                value={newEducation.field}
                onValueChange={(val) =>
                  setNewEducation((prev) => ({ ...prev, field: val }))
                }
              />
            </div>
            <Input
              label="Location"
              value={newEducation.location}
              onValueChange={(val) =>
                setNewEducation((prev) => ({ ...prev, location: val }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={newEducation.startDate}
                onChange={(e) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
              <div className="flex flex-col">
                <Input
                  label="End Date"
                  type="month"
                  isDisabled={newEducation.current}
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEducation.current}
                    onChange={(e) =>
                      handleCurrentChange(e.target.checked)
                    }
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
                isDisabled={
                  !newEducation.school ||
                  !newEducation.degree ||
                  !newEducation.startDate
                }
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Edit Education */}
        {editingId !== null && editEducation && (
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-semibold">Edit Education</h4>
            <Input
              label="School/University"
              value={editEducation.school}
              onValueChange={(val) =>
                setEditEducation((prev) => ({ ...prev!, school: val }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree"
                value={editEducation.degree}
                onValueChange={(val) =>
                  setEditEducation((prev) => ({ ...prev!, degree: val }))
                }
              />
              <Input
                label="Field of Study"
                value={editEducation.field}
                onValueChange={(val) =>
                  setEditEducation((prev) => ({ ...prev!, field: val }))
                }
              />
            </div>
            <Input
              label="Location"
              value={editEducation.location}
              onValueChange={(val) =>
                setEditEducation((prev) => ({ ...prev!, location: val }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={editEducation.startDate}
                onChange={(e) =>
                  setEditEducation((prev) => ({
                    ...prev!,
                    startDate: e.target.value,
                  }))
                }
              />
              <div className="flex flex-col">
                <Input
                  label="End Date"
                  type="month"
                  isDisabled={editEducation.current}
                  value={editEducation.endDate}
                  onChange={(e) =>
                    setEditEducation((prev) => ({
                      ...prev!,
                      endDate: e.target.value,
                    }))
                  }
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editEducation.current}
                    onChange={(e) =>
                      setEditEducation((prev) => ({
                        ...prev!,
                        current: e.target.checked,
                        endDate: e.target.checked ? "" : prev!.endDate,
                      }))
                    }
                  />
                  <span className="text-sm">I'm currently studying here</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="flat" onPress={() => setEditingId(null)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleUpdateEducation}
                isDisabled={
                  !editEducation.school ||
                  !editEducation.degree ||
                  !editEducation.startDate
                }
              >
                Update
              </Button>
            </div>
          </div>
        )}

        {/* Education List */}
        <div className="space-y-6">
          {
            educations.length === 0 &&
            <div className="text-gray-400">
              You have not include any educations yet. Please consider add more educations
            </div>
          }

          {educations.map((edu, index) => (
            <div key={edu._id ?? edu.id ?? index} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{edu.school}</h4>
                  <p className="text-default-600">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-default-500">
                    {edu.location} •{" "}
                    {new Date(edu.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {edu.current
                      ? "Present"
                      : new Date(edu.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    color="primary"
                    onPress={() => handleEdit(edu)}
                  >
                    <Icon icon="lucide:pencil" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleRemoveEducation(edu.id!)}
                  >
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </div>
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
