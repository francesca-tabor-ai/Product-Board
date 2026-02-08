
import React, { useState, useEffect } from 'react';
import { View, Insight, Feature, ScoringWeights, Organisation, UserIdea, TechStackProfile, CustomerIntelligenceData, CustomerSegment } from './types';
import { INITIAL_INSIGHTS, INITIAL_FEATURES, DEFAULT_WEIGHTS, INITIAL_ORGANISATION, INITIAL_IDEAS, INITIAL_TECH_STACK, INITIAL_CUSTOMER_DATA } from './constants';
import Sidebar from './components/Sidebar';
import InsightsBoard from './components/InsightsBoard';
import FeaturesTable from './components/FeaturesTable';
import RoadmapView from './components/RoadmapView';
import FeatureDetail from './components/FeatureDetail';
import RevenueIntelligence from './components/RevenueIntelligence';
import OrganisationIntelligence from './components/OrganisationIntelligence';
import PortalView from './components/PortalView';
import TechStackView from './components/TechStackView';
import CustomerIntelligence from './components/CustomerIntelligence';
import VibeCodeView from './components/VibeCodeView';
import PricingPlanBuilder from './components/PricingPlanBuilder';
import AccountManagement from './components/AccountManagement';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.ORGANISATION);
  const [insights] = useState<Insight[]>(INITIAL_INSIGHTS);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [organisation, setOrganisation] = useState<Organisation>(INITIAL_ORGANISATION);
  const [ideas, setIdeas] = useState<UserIdea[]>(INITIAL_IDEAS);
  const [techStack, setTechStack] = useState<TechStackProfile>(INITIAL_TECH_STACK);
  const [customerData, setCustomerData] = useState<CustomerIntelligenceData>(INITIAL_CUSTOMER_DATA);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  // Initialize and recalc features based on default weights on mount
  useEffect(() => {
    const recalced = INITIAL_FEATURES.map(f => {
      const wv = (
        f.dimensions.customerValue * DEFAULT_WEIGHTS.customerValue +
        f.dimensions.competitive * DEFAULT_WEIGHTS.competitive +
        f.dimensions.financial * DEFAULT_WEIGHTS.financial +
        f.dimensions.strategic * DEFAULT_WEIGHTS.strategic +
        f.dimensions.caseStudy * DEFAULT_WEIGHTS.caseStudy
      );
      const finalScore = f.dimensions.effort > 0 ? wv / f.dimensions.effort : wv;
      return { 
        ...f, 
        weightedValue: wv, 
        finalScore: parseFloat(finalScore.toFixed(2)) 
      };
    });
    setFeatures(recalced);
  }, []);

  const handleUpdateFeature = (updated: Feature) => {
    setFeatures(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const handleUpdateFeatures = (updatedList: Feature[]) => {
    setFeatures(updatedList);
  };

  const handleUpdateOrganisation = (updated: Organisation) => {
    setOrganisation(updated);
  };

  const handleVoteIdea = (id: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    ));
  };

  const handleSubmitIdea = (title: string, description: string) => {
    const newIdea: UserIdea = {
      id: `idea-${Date.now()}`,
      title,
      description,
      votes: 1,
      status: 'under-consideration',
      category: 'User Request',
      author: 'You'
    };
    setIdeas(prev => [newIdea, ...prev]);
  };

  const handleUpdateStack = (updated: TechStackProfile) => {
    setTechStack(updated);
  };

  const handleAddCustomerSegment = (seg: CustomerSegment) => {
    setCustomerData(prev => ({
      ...prev,
      segments: [...prev.segments, seg]
    }));
  };

  const handleSetCustomerSegments = (segs: CustomerSegment[]) => {
    setCustomerData(prev => ({
      ...prev,
      segments: segs
    }));
  };

  const selectedFeature = features.find(f => f.id === selectedFeatureId);

  const renderView = () => {
    switch (currentView) {
      case View.ORGANISATION:
        return (
          <OrganisationIntelligence 
            organisation={organisation} 
            onUpdateOrganisation={handleUpdateOrganisation} 
          />
        );
      case View.CUSTOMER:
        return (
          <CustomerIntelligence 
            data={customerData} 
            features={features}
            onAddSegment={handleAddCustomerSegment}
            onSetSegments={handleSetCustomerSegments}
          />
        );
      case View.PRICING:
        return <PricingPlanBuilder features={features} />;
      case View.REVENUE:
        return (
          <RevenueIntelligence 
            features={features} 
            onSelectFeature={setSelectedFeatureId} 
            onUpdateFeatures={handleUpdateFeatures}
          />
        );
      case View.ROADMAP:
        return <RoadmapView features={features} onSelectFeature={setSelectedFeatureId} onUpdateFeature={handleUpdateFeature} />;
      case View.FEATURES:
        return <FeaturesTable features={features} onSelectFeature={setSelectedFeatureId} onUpdateFeature={handleUpdateFeature} />;
      case View.TECH_STACK:
        return <TechStackView stack={techStack} onUpdateStack={handleUpdateStack} />;
      case View.VIBE_CODE:
        return <VibeCodeView stack={techStack} features={features} />;
      case View.PORTAL:
        return <PortalView ideas={ideas} onVote={handleVoteIdea} onSubmitIdea={handleSubmitIdea} />;
      case View.INSIGHTS:
        return <InsightsBoard insights={insights} />;
      case View.ACCOUNT:
        return <AccountManagement />;
      default:
        return <InsightsBoard insights={insights} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        {renderView()}
        
        {/* Full Page Detail Overlay */}
        {selectedFeature && (
          <FeatureDetail 
            feature={selectedFeature} 
            insights={insights}
            weights={weights}
            onUpdateFeature={handleUpdateFeature}
            onClose={() => setSelectedFeatureId(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
