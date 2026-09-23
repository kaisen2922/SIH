import React from 'react';
import { FloodMap } from '../components/map/FloodMap';
import { MicroCatchment, SensorNode, InfrastructureAsset, CitizenReport } from '../types';

interface MapPageProps {
  catchments: MicroCatchment[];
  sensors: SensorNode[];
  infrastructure: InfrastructureAsset[];
  reports: CitizenReport[];
  selectedCatchment: MicroCatchment | null;
  onSelectCatchment: (catchment: MicroCatchment | null) => void;
  onNavigate: (tab: string, params?: any) => void;
  timelineMinutes: number;
}

export const MapPage: React.FC<MapPageProps> = (props) => {
  return (
    <div className="w-full h-full relative">
      <FloodMap {...props} onNavigateToModule={props.onNavigate} />
    </div>
  );
};
