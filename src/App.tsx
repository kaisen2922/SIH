import React, { useState } from 'react';
import { UserRole } from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GlobalIncidentBar } from './components/common/GlobalIncidentBar';
import { DemoWalkthroughBar } from './components/common/DemoWalkthroughBar';
import { DataProvenanceModal } from './components/common/DataProvenanceModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { CatchmentsPage } from './pages/CatchmentsPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { RoutesPage } from './pages/RoutesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { FieldResponsePage } from './pages/FieldResponsePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicPortalPage } from './pages/PublicPortalPage';
import { ReportSubmissionModal } from './components/reports/ReportSubmissionModal';
import { IncidentProvider, useIncident } from './context/IncidentContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('officer');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [navParams, setNavParams] = useState<any>({});
  const [isWalkthroughBarOpen, setIsWalkthroughBarOpen] = useState(true);

  const {
    catchments,
    sensors,
    infrastructure,
    reports,
    alerts,
    routes,
    selectedCatchment,
    selectCatchment,
    timelineMinutes,
    simulationState,
    broadcastAlert,
    verifyCitizenReport,
  } = useIncident();

  const handleNavigate = (tab: string, params?: any) => {
    if (params) {
      setNavParams(params);
    }
    setActiveTab(tab);
  };

  const handleOpenAlertModal = (prefill?: any) => {
    setNavParams({ prefillAlert: prefill });
    setActiveTab('alerts');
  };

  // If on landing page, show landing gateway
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={() => setActiveTab('dashboard')}
        onEnterPublic={() => setActiveTab('public')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Command Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Persistent Global Incident Context Bar (Section 2) */}
      {activeTab !== 'public' && (
        <GlobalIncidentBar onNavigate={handleNavigate} />
      )}

      {/* Guided Simulation Replay Bar (Shown when active or user opens) */}
      {(simulationState !== 'IDLE' || isWalkthroughBarOpen) && activeTab !== 'public' && (
        <DemoWalkthroughBar onClose={() => setIsWalkthroughBarOpen(false)} />
      )}

      {/* Main Command Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        {activeTab !== 'public' && (
          <Sidebar activeTab={activeTab} onNavigate={handleNavigate} currentRole={currentRole} />
        )}

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto bg-navy-950">
          {activeTab === 'dashboard' && (
            <DashboardPage
              catchments={catchments}
              alerts={alerts}
              reports={reports}
              onNavigate={handleNavigate}
              onSelectCatchment={(c) => selectCatchment(c)}
            />
          )}

          {activeTab === 'map' && (
            <MapPage
              catchments={catchments}
              sensors={sensors}
              infrastructure={infrastructure}
              reports={reports}
              selectedCatchment={selectedCatchment}
              onSelectCatchment={(c) => selectCatchment(c)}
              onNavigate={handleNavigate}
              timelineMinutes={timelineMinutes}
            />
          )}

          {activeTab === 'catchments' && (
            <CatchmentsPage
              catchments={catchments}
              selectedCatchment={selectedCatchment}
              onSelectCatchment={(c) => selectCatchment(c)}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionsPage
              catchments={catchments}
              selectedCatchment={selectedCatchment}
              explainableFactors={[]}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'infrastructure' && (
            <InfrastructurePage
              infrastructure={infrastructure}
              onNavigate={handleNavigate}
              onOpenAlertModal={handleOpenAlertModal}
            />
          )}

          {activeTab === 'routes' && (
            <RoutesPage
              routes={routes}
              onNavigate={handleNavigate}
              initialDestination={navParams?.destination}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onCreateAlert={broadcastAlert}
              prefillAlert={navParams?.prefillAlert}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'field' && (
            <FieldResponsePage onNavigate={handleNavigate} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'datasources' && (
            <DataSourcesPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage currentRole={currentRole} onRoleChange={setCurrentRole} />
          )}

          {activeTab === 'public' && (
            <PublicPortalPage
              onNavigate={handleNavigate}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Citizen Report Modal */}
      <ReportSubmissionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={() => setIsReportModalOpen(false)}
      />

      {/* Global Data Lineage & Algorithmic Provenance Modal (Section 11) */}
      <DataProvenanceModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <AppContent />
    </IncidentProvider>
  );
};
