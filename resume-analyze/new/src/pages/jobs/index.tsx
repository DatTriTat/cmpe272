import React from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { fetchJobsFromBackend, Job } from "../../utils/api";

const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedLocation, setSelectedLocation] =
    React.useState("All Locations");
  const [searchTemp, setSearchTemp] = React.useState("");
  const [local, setLocal] = React.useState("");
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedJobType, setSelectedJobType] = React.useState("All Types");

  const locations = [
    "All Locations",
    ...Array.from(new Set(jobs.map((job) => job.location).filter(Boolean))),
  ];
  const jobsPerPage = 10;
  const jobTypes = [
    "All Types",
    "Full-time",
    "Part-time",
    "Contractor",
    "Internship",
  ];
  React.useEffect(() => {
    const savedJobs = localStorage.getItem("jobResults");
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch {
        localStorage.removeItem("jobResults");
      }
    }
  }, []);

  const handleSearch = async () => {
    setSearchQuery(searchTemp);
    setLoading(true);
    setError(null);
    try {
      const result = await fetchJobsFromBackend({
        title: searchTemp || undefined,
        location: local || undefined,
      });
      setJobs(result);
      localStorage.setItem("jobResults", JSON.stringify(result));
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" ||
      job.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesType =
      selectedJobType === "All Types" || job.type === selectedJobType;

    return matchesSearch && matchesLocation && matchesType;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Job Matches</h1>

        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search jobs or companies"
                value={searchTemp}
                onValueChange={setSearchTemp}
                startContent={
                  <Icon icon="lucide:search" className="text-default-400" />
                }
                className="flex-1"
              />
              <Input
                placeholder="Location"
                value={local}
                onValueChange={(val) => setLocal(val || "")}
                className="w-48"
                startContent={
                  <Icon icon="lucide:map-pin" className="text-default-400" />
                }
              />
              <div className="flex-shrink-0">
                <Button
                  color="primary"
                  onPress={handleSearch}
                  isLoading={loading}
                  startContent={<Icon icon="lucide:search" />}
                >
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      endContent={
                        <Icon
                          icon="lucide:chevron-down"
                          width={16}
                          height={16}
                        />
                      }
                    >
                      {selectedLocation}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Location filter"
                    onAction={(key) => setSelectedLocation(key as string)}
                    selectedKeys={[selectedLocation]}
                    selectionMode="single"
                  >
                    {locations.map((location) => (
                      <DropdownItem key={location}>{location}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      endContent={
                        <Icon
                          icon="lucide:chevron-down"
                          width={16}
                          height={16}
                        />
                      }
                    >
                      {selectedJobType}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Job type filter"
                    onAction={(key) => setSelectedJobType(key as string)}
                    selectedKeys={[selectedJobType]}
                    selectionMode="single"
                  >
                    {jobTypes.map((type) => (
                      <DropdownItem key={type}>{type}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </CardBody>
        </Card>

        {/* Job Cards */}
        <div className="space-y-3">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job, idx) => (
              <Card key={job.id || idx} className="px-4 py-3">
                <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-sm text-default-500">
                      {job.location} -- {job.type}
                    </p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <Button
                      color="primary"
                      as="a"
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      startContent={<Icon icon="lucide:send" />}
                      className="min-w-[110px]"
                    >
                      Apply
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <Icon
                    icon="lucide:search-x"
                    className="mx-auto mb-4 text-default-400"
                    width={48}
                    height={48}
                  />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <Button
                    color="primary"
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedLocation("All Locations");
                      setSelectedJobType("All Types");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={i + 1 === currentPage ? "solid" : "bordered"}
                onPress={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
