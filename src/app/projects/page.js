import Directory from "@components/directory/directory";
import { directoryConfig } from '@config/projectsDirectoryConfig';

export default function Projects() {
  return (
    <Directory config={directoryConfig} />
  );
}