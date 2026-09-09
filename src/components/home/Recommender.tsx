import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Placement, Plant, Purpose, RecommenderAnswers, Sunlight } from '@/types';
import SectionHead from '@/components/ui/SectionHead';
import Icon from '@/components/ui/Icon';
import PlantCard from '@/components/plants/PlantCard';
import EmptyState from '@/components/ui/EmptyState';
import plantService from '@/services/plantService';
import { SkeletonCard } from '@/components/ui/Skeleton';

type StepKey = keyof RecommenderAnswers;

interface Step {
  key: StepKey;
  question: string;
  helper: string;
  options: { value: string; label: string; icon: Parameters<typeof Icon>[0]['name'] }[];
}

const steps: Step[] = [
  {
    key: 'placement',
    question: 'Where will you keep the plant?',
    helper: 'This decides more than anything else on the list.',
    options: [
      { value: 'home', label: 'Home', icon: 'home' },
      { value: 'office', label: 'Office', icon: 'building' },
      { value: 'balcony', label: 'Balcony', icon: 'grid' },
      { value: 'terrace', label: 'Terrace', icon: 'building' },
      { value: 'garden', label: 'Garden', icon: 'tree' },
    ],
  },
  {
    key: 'sunlight',
    question: 'How much sunlight does that spot get?',
    helper: 'Stand there mid-morning and see whether direct sun reaches it.',
    options: [
      { value: 'low-light', label: 'Low Light', icon: 'layers' },
      { value: 'partial-sun', label: 'Partial Sun', icon: 'sun' },
      { value: 'full-sun', label: 'Full Sun', icon: 'sun' },
    ],
  },
  {
    key: 'maintenance',
    question: 'How much looking after can you give it?',
    helper: 'Be honest — a forgiving plant you keep alive beats a demanding one you lose.',
    options: [
      { value: 'low', label: 'Low', icon: 'check-circle' },
      { value: 'medium', label: 'Medium', icon: 'droplet' },
      { value: 'high', label: 'High', icon: 'scissors' },
    ],
  },
  {
    key: 'purpose',
    question: 'What do you want from the plant?',
    helper: 'Pick the one that matters most to you.',
    options: [
      { value: 'decorative', label: 'Decorative', icon: 'sparkle' },
      { value: 'flowering', label: 'Flowering', icon: 'butterfly' },
      { value: 'fruit', label: 'Fruit', icon: 'basket' },
      { value: 'air-greenery', label: 'Air / Greenery', icon: 'leaf' },
      { value: 'garden', label: 'Garden', icon: 'shovel' },
    ],
  },
];

/**
 * Section I — "Help me choose a plant".
 * A real interaction: answers are scored against the plant data by
 * plantService.recommend(), so it will work identically against a live
 * inventory once the data source changes.
 */
export function Recommender() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RecommenderAnswers>({});
  const [results, setResults] = useState<Plant[] | null>(null);
  const [loading, setLoading] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const progress = results ? 100 : (stepIndex / steps.length) * 100;

  const runRecommendation = useCallback(async (finalAnswers: RecommenderAnswers) => {
    setLoading(true);
    const found = await plantService.recommend(finalAnswers, 4);
    setResults(found);
    setLoading(false);
  }, []);

  const choose = (value: string) => {
    const next = { ...answers, [step.key]: value } as RecommenderAnswers;
    setAnswers(next);
    if (isLast) void runRecommendation(next);
    else setStepIndex((i) => i + 1);
  };

  const reset = () => {
    setAnswers({});
    setResults(null);
    setStepIndex(0);
  };

  const summary = useMemo(() => {
    const labels: string[] = [];
    steps.forEach((s) => {
      const value = answers[s.key];
      const match = s.options.find((o) => o.value === value);
      if (match) labels.push(match.label);
    });
    return labels;
  }, [answers]);

  useEffect(() => {
    if (results) {
      document.getElementById('recommender-results')?.focus();
    }
  }, [results]);

  return (
    <section className="section recommender" aria-labelledby="recommender-title" id="help-me-choose">
      <div className="container">
        <SectionHead
          center
          eyebrow="Need Help Choosing?"
          title="Not Sure Which Plant Is Right For You?"
          description="Four quick questions. We will suggest plants from our catalogue that suit your space."
        />

        <div className="recommender__panel">
          <div className="recommender__progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          {!results && (
            <div className="recommender__step">
              <p className="recommender__count">
                Question {stepIndex + 1} of {steps.length}
              </p>
              <h3 id="recommender-question">{step.question}</h3>
              <p className="muted recommender__helper">{step.helper}</p>

              <div className="recommender__options" role="group" aria-labelledby="recommender-question">
                {step.options.map((option) => (
                  <button
                    key={option.value}
                    className={`recommender__option ${answers[step.key] === option.value ? 'is-active' : ''}`}
                    onClick={() => choose(option.value as Placement & Sunlight & Purpose)}
                  >
                    <Icon name={option.icon} size={22} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {stepIndex > 0 && (
                <button className="link-arrow recommender__back" onClick={() => setStepIndex((i) => i - 1)}>
                  <Icon name="chevron-left" size={16} /> Back
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="recommender__results">
              <div className="grid cols-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="recommender__results" id="recommender-results" tabIndex={-1}>
              <div className="recommender__summary">
                <div>
                  <p className="eyebrow">Your answers</p>
                  <ul className="recommender__chips">
                    {summary.map((label) => (
                      <li key={label} className="badge badge--soft">{label}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn--secondary btn--sm" onClick={reset}>
                  <Icon name="recycle" size={16} /> Start again
                </button>
              </div>

              {results.length > 0 ? (
                <>
                  <h3 className="recommender__results-title">Plants we would suggest</h3>
                  <div className="grid cols-4">
                    {results.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
                  </div>
                  <div className="row recommender__after">
                    <Link to="/plants" className="btn btn--secondary">Browse the full catalogue</Link>
                    <Link to="/book" className="btn btn--primary">Talk to our team</Link>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Nothing matched exactly"
                  message="Tell us about the space and we will suggest something from the nursery."
                  action={
                    <>
                      <button className="btn btn--secondary" onClick={reset}>Change my answers</button>
                      <Link to="/contact" className="btn btn--primary">Talk to our team</Link>
                    </>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Recommender;
