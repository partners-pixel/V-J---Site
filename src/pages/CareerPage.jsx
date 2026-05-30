import { useEffect, useState } from 'react';
import MigratedHtmlPage from './MigratedHtmlPage.jsx';
import CareerApplyModal from '../components/CareerApplyModal.jsx';
import { routeBySlug } from '../data/routes.js';

const careerRoute = routeBySlug.career;

export default function CareerPage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);
    const previous = window.openCareerApply;
    window.openCareerApply = openModal;
    return () => {
      window.openCareerApply = previous;
    };
  }, []);

  return (
    <>
      <MigratedHtmlPage route={careerRoute} />
      <CareerApplyModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
