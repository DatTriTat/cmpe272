import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Textarea,
  Divider,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import SkillsSection from "../../components/profile/skills-section";
import ExperienceSection from "../../components/profile/experience-section";
import EducationSection from "../../components/profile/education-section";
import { useAuth } from "../../context/AuthContext";
import { saveUserProfile } from "../../utils/api";
import { fetchCareerSuggestions } from "../../utils/fetchResumePipeline";
import { AlertPopup } from "../../components/AlertPopup";
import { useNavigate } from "react-router-dom";
const UserProfilePage: React.FC = () => {
  const { user, logout, loading, setUser } = useAuth();
  const [selected, setSelected] = useState("basic");
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const workTypes = ["Intern", "Full-time", "Part-time"];
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = React.useState("");
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    jobTitle: "",
    phone: "",
    location: "",
    summary: "",
    objective: "",
    desiredRole: "",
    desiredSalary: "",
    workType: "",
    availability: "",
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setBasicInfo({
        fullName: user.profile.fullName || "",
        email: user.email || "",
        jobTitle: user.profile.jobTitle || "",
        phone: user.profile.phone || "",
        location: user.profile.location || "",
        summary: user.profile.summary || "",
        objective: user.profile.objective || "",
        desiredRole: user.profile.desiredRole || "",
        desiredSalary: user.profile.desiredSalary || "",
        workType: user.profile.workType || "",
        availability: user.profile.availability || "",
      });

      setSkills(user.profile.skills || []);
      setExperiences(user.profile.experiences || []);
      setEducations(user.profile.educations || []);
    }
  }, [user]);

  const handleSave = async () => {
    const profile = {
      ...basicInfo,
      skills,
      experiences,
      educations,
    };
    try {
      await saveUserProfile(user.token, profile, setUser);
      setText("Profile saved successfully!");
      setShowAlert(true);
    } catch (err) {
      setText("Failed to save profile.");
      setShowAlert(true);
    }
  };
  const handleGetCareerSuggestions = async () => {
    if (!user?.token) {
      setText("You must be logged in to get career suggestions.");
      setShowAlert(true);
      return;
    }
    const profile = {
      ...basicInfo,
      skills,
      experiences,
      educations,
    };
    setIsLoadingSuggestions(true);

    try {
      await saveUserProfile(user.token, profile, setUser);
      const suggestions = await fetchCareerSuggestions(user.token);
      localStorage.removeItem("savedCareerPaths");

      if (!suggestions) {
        setText("No career suggestions found.");
        setShowAlert(true);
        return;
      }
      const withId = suggestions.map((s, index) => ({
        ...s,
        id: index + 1,
      }));
      localStorage.setItem("careerSuggestions", JSON.stringify(withId));
      setText("Career suggestions fetched successfully!");
      setShowAlert(true);
      navigate("/career-paths");
    } catch (err) {
      setText("Failed to fetch career suggestions.");
      setShowAlert(true);
    } finally {
      setIsLoadingSuggestions(false); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Icon icon="heroicons:light-bulb" />}
              onPress={handleGetCareerSuggestions}
              isLoading={isLoadingSuggestions}

            >
              Career Suggestions
            </Button>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:save" />}
              onPress={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                  className="w-24 h-24"
                />
                <Button size="sm" variant="flat">
                  Change Photo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={basicInfo.fullName}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, fullName: val })
                    }
                  />
                  <Input
                    label="Job Title"
                    value={basicInfo.jobTitle}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, jobTitle: val })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    value={basicInfo.email}
                    type="email"
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, email: val })
                    }
                  />
                  <Input
                    label="Phone"
                    value={basicInfo.phone}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, phone: val })
                    }
                  />
                </div>
                <Input
                  label="Location"
                  value={basicInfo.location}
                  onValueChange={(val) =>
                    setBasicInfo({ ...basicInfo, location: val })
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Tabs
          aria-label="Profile sections"
          selectedKey={selected}
          onSelectionChange={setSelected as any}
          className="w-full"
        >
          <Tab key="basic" title="Basic Information">
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Professional Summary
                  </h3>
                  <Textarea
                    minRows={4}
                    value={basicInfo.summary}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, summary: val })
                    }
                  />
                </div>

                <Divider />

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Career Objectives
                  </h3>
                  <Textarea
                    minRows={3}
                    value={basicInfo.objective}
                    onValueChange={(val) =>
                      setBasicInfo({ ...basicInfo, objective: val })
                    }
                  />
                </div>

                <Divider />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Job Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Desired Role"
                      value={basicInfo.desiredRole}
                      onValueChange={(val) =>
                        setBasicInfo({ ...basicInfo, desiredRole: val })
                      }
                    />
                    <Input
                      label="Desired Salary"
                      value={basicInfo.desiredSalary}
                      onValueChange={(val) =>
                        setBasicInfo({ ...basicInfo, desiredSalary: val })
                      }
                    />
                    <Select
                      label="Work Type"
                      selectedKeys={[basicInfo.workType]}
                      onSelectionChange={(keys) =>
                        setBasicInfo({
                          ...basicInfo,
                          workType: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      {workTypes.map((type) => (
                        <SelectItem key={type}>{type}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Availability"
                      value={basicInfo.availability}
                      onValueChange={(val) =>
                        setBasicInfo({ ...basicInfo, availability: val })
                      }
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="skills" title="Skills">
            <SkillsSection setSkills={setSkills} skills={skills} />
          </Tab>
          <Tab key="experience" title="Experience">
            <ExperienceSection
              setExperiences={setExperiences}
              experiences={experiences}
            />
          </Tab>
          <Tab key="education" title="Education">
            <EducationSection
              setEducations={setEducations}
              educations={educations}
            />
          </Tab>
        </Tabs>
        {showAlert && (
          <AlertPopup
            message={text}
            duration={3000}
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
