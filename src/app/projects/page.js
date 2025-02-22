import Directory from "@components/Directory/Directory";
import { directoryConfig } from '@config/projectsDirectoryConfig';

export default function Projects() {
  return (
    <Directory config={directoryConfig} />
  );
}