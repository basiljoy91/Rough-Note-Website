import type { CSSProperties, ReactNode } from 'react';
import { LockDoodle } from '../components/Doodles';
import styles from '../rough-note-contact.module.css';

export interface PaperFacet {
  id: string;
  clipPath: string;
  initialTransform: string;
  finalTransform: string;
  zIndex: number;
  transformOrigin: string;
  shadowIntensity: number;
}

export const PAPER_FACETS: PaperFacet[] = [
  {
    id: 'outer-0',
    clipPath: "polygon(97.0% 22.0%, 93.2% 36.6%, 79.3% 43.5%, 68.4% 47.6%, 58.1% 53.0%, 47.8% 47.4%, 26.9% 55.4%, 21.9% 39.1%, 15.1% 24.9%, 16.1% 8.7%, 33.3% 2.1%, 35.9% 0.0%, 53.9% 0.0%, 64.4% 0.0%, 74.9% 0.0%, 85.6% 5.5%, 87.7% 17.7%)",
    initialTransform: 'translate3d(-4px,3px,18px) rotate(-13deg) rotateX(-15deg) rotateY(-9deg) scale(0.95)',
    finalTransform: 'translate3d(0px,-1px,2px) rotate(0.3deg) rotateX(0.2deg) rotateY(0.3deg) scale(1)',
    zIndex: 7,
    transformOrigin: '40% 55%',
    shadowIntensity: 0.24
  },
  {
    id: 'outer-1',
    clipPath: "polygon(82.0% 56.0%, 67.6% 63.1%, 60.8% 66.4%, 63.0% 85.2%, 50.6% 72.0%, 42.5% 76.7%, 38.0% 69.4%, 33.8% 63.9%, 35.0% 57.0%, 28.1% 48.9%, 33.9% 42.5%, 34.5% 26.9%, 46.1% 19.2%, 54.4% 40.6%, 66.0% 35.5%, 66.5% 46.5%, 81.7% 51.5%)",
    initialTransform: 'translate3d(2px,-7px,8px) rotate(8deg) rotateX(5deg) rotateY(11deg) scale(0.95)',
    finalTransform: 'translate3d(0px,-1px,1px) rotate(-0.1deg) rotateX(-0.0deg) rotateY(0.7deg) scale(1)',
    zIndex: 7,
    transformOrigin: '42% 36%',
    shadowIntensity: 0.33
  },
  {
    id: 'outer-2',
    clipPath: "polygon(66.0% 61.0%, 63.2% 75.6%, 45.7% 79.1%, 46.5% 100.0%, 28.0% 91.0%, 15.0% 93.9%, 0.2% 90.7%, 0.0% 78.1%, 0.0% 63.9%, 0.0% 49.6%, 0.0% 32.7%, 8.2% 25.7%, 24.0% 32.2%, 39.1% 18.7%, 51.0% 30.3%, 54.7% 45.0%, 52.7% 57.4%)",
    initialTransform: 'translate3d(7px,-5px,17px) rotate(-15deg) rotateX(-15deg) rotateY(-5deg) scale(0.95)',
    finalTransform: 'translate3d(-1px,-1px,0px) rotate(0.1deg) rotateX(0.0deg) rotateY(-0.3deg) scale(1)',
    zIndex: 5,
    transformOrigin: '32% 68%',
    shadowIntensity: 0.19
  },
  {
    id: 'outer-3',
    clipPath: "polygon(100.0% 47.0%, 100.0% 60.9%, 100.0% 76.9%, 89.6% 70.8%, 80.3% 83.0%, 65.0% 85.5%, 47.6% 81.9%, 43.9% 64.1%, 40.1% 49.7%, 44.8% 35.9%, 49.9% 22.6%, 61.2% 13.4%, 74.5% 4.2%, 90.6% 6.6%, 100.0% 13.9%, 100.0% 23.0%, 100.0% 42.5%)",
    initialTransform: 'translate3d(-4px,-9px,14px) rotate(1deg) rotateX(-1deg) rotateY(13deg) scale(0.95)',
    finalTransform: 'translate3d(-1px,0px,2px) rotate(-0.2deg) rotateX(-0.1deg) rotateY(0.6deg) scale(1)',
    zIndex: 5,
    transformOrigin: '39% 33%',
    shadowIntensity: 0.34
  },
  {
    id: 'outer-4',
    clipPath: "polygon(98.0% 44.0%, 77.0% 54.1%, 82.2% 73.2%, 68.7% 81.5%, 52.9% 69.0%, 37.0% 85.3%, 37.3% 60.3%, 26.8% 56.3%, 30.1% 45.5%, 26.3% 35.7%, 17.5% 15.1%, 38.9% 19.3%, 48.3% 9.2%, 63.0% 5.5%, 78.5% 10.1%, 71.9% 32.5%, 76.8% 40.5%)",
    initialTransform: 'translate3d(5px,7px,13px) rotate(5deg) rotateX(4deg) rotateY(11deg) scale(0.95)',
    finalTransform: 'translate3d(1px,1px,2px) rotate(-0.3deg) rotateX(-0.2deg) rotateY(-0.1deg) scale(1)',
    zIndex: 8,
    transformOrigin: '53% 69%',
    shadowIntensity: 0.23
  },
  {
    id: 'outer-5',
    clipPath: "polygon(62.0% 23.0%, 61.5% 36.1%, 53.5% 46.6%, 43.6% 55.9%, 29.8% 45.0%, 17.7% 54.0%, 3.6% 51.2%, 0.0% 39.2%, 1.1% 25.0%, 8.1% 16.2%, 6.0% 3.7%, 14.9% 0.0%, 26.6% 0.1%, 34.0% 5.7%, 45.6% 1.7%, 62.8% 3.5%, 55.7% 19.2%)",
    initialTransform: 'translate3d(2px,11px,15px) rotate(-4deg) rotateX(2deg) rotateY(11deg) scale(0.95)',
    finalTransform: 'translate3d(-1px,1px,1px) rotate(0.7deg) rotateX(0.3deg) rotateY(-0.5deg) scale(1)',
    zIndex: 7,
    transformOrigin: '50% 44%',
    shadowIntensity: 0.33
  },
  {
    id: 'outer-6',
    clipPath: "polygon(88.0% 52.0%, 82.9% 62.9%, 90.5% 85.3%, 69.8% 83.1%, 57.7% 100.0%, 40.6% 94.3%, 32.6% 78.0%, 12.0% 73.5%, 12.1% 55.1%, 15.1% 38.7%, 30.0% 30.1%, 41.9% 25.5%, 53.0% 23.2%, 64.5% 22.2%, 86.2% 13.4%, 79.4% 38.5%, 95.6% 46.4%)",
    initialTransform: 'translate3d(13px,-12px,17px) rotate(-5deg) rotateX(9deg) rotateY(6deg) scale(0.95)',
    finalTransform: 'translate3d(1px,1px,1px) rotate(0.4deg) rotateX(0.2deg) rotateY(0.6deg) scale(1)',
    zIndex: 6,
    transformOrigin: '35% 40%',
    shadowIntensity: 0.22
  },
  {
    id: 'outer-7',
    clipPath: "polygon(94.0% 80.0%, 100.0% 95.4%, 100.0% 100.0%, 80.4% 100.0%, 70.0% 100.0%, 58.7% 100.0%, 46.2% 100.0%, 42.0% 93.2%, 23.1% 83.2%, 44.3% 72.0%, 43.7% 58.8%, 54.0% 51.7%, 64.0% 32.3%, 77.0% 52.1%, 95.5% 46.1%, 98.4% 63.0%, 100.0% 74.4%)",
    initialTransform: 'translate3d(2px,-14px,18px) rotate(-10deg) rotateX(10deg) rotateY(4deg) scale(0.95)',
    finalTransform: 'translate3d(-1px,-1px,2px) rotate(0.7deg) rotateX(0.3deg) rotateY(0.3deg) scale(1)',
    zIndex: 8,
    transformOrigin: '56% 46%',
    shadowIntensity: 0.20
  },
  {
    id: 'middle-0',
    clipPath: "polygon(77.0% 21.0%, 70.4% 29.2%, 69.4% 39.8%, 58.9% 41.1%, 50.6% 38.0%, 40.1% 48.3%, 36.6% 35.9%, 16.7% 37.2%, 13.1% 23.6%, 29.1% 14.2%, 36.2% 9.4%, 38.7% 0.0%, 48.3% 5.1%, 55.5% 1.8%, 64.8% 2.1%, 77.7% 5.0%, 69.8% 18.2%)",
    initialTransform: 'translate3d(9px,6px,18px) rotate(-14deg) rotateX(-23deg) rotateY(-19deg) scale(0.98)',
    finalTransform: 'translate3d(0px,-1px,1px) rotate(0.6deg) rotateX(0.3deg) rotateY(0.4deg) scale(1)',
    zIndex: 15,
    transformOrigin: '36% 66%',
    shadowIntensity: 0.26
  },
  {
    id: 'middle-1',
    clipPath: "polygon(50.0% 48.0%, 65.1% 63.0%, 46.0% 65.4%, 39.4% 73.6%, 29.0% 76.0%, 13.6% 87.5%, 12.6% 65.1%, 3.7% 59.8%, 0.0% 50.2%, 1.4% 39.3%, 0.0% 23.6%, 12.0% 18.0%, 23.6% 6.2%, 36.3% 19.2%, 50.2% 19.6%, 64.4% 27.0%, 55.7% 44.1%)",
    initialTransform: 'translate3d(1px,0px,23px) rotate(-2deg) rotateX(1deg) rotateY(15deg) scale(0.98)',
    finalTransform: 'translate3d(-1px,-1px,2px) rotate(0.0deg) rotateX(0.0deg) rotateY(0.5deg) scale(1)',
    zIndex: 14,
    transformOrigin: '60% 46%',
    shadowIntensity: 0.31
  },
  {
    id: 'middle-2',
    clipPath: "polygon(49.0% 23.0%, 47.3% 32.0%, 48.0% 45.2%, 31.1% 36.7%, 25.9% 48.0%, 13.7% 54.0%, 4.9% 45.3%, 3.4% 33.5%, 4.1% 24.5%, 0.0% 13.7%, 11.2% 11.4%, 14.7% 3.6%, 22.3% 0.0%, 30.8% 2.8%, 42.9% 0.1%, 40.6% 14.0%, 41.8% 20.6%)",
    initialTransform: 'translate3d(3px,-15px,22px) rotate(2deg) rotateX(5deg) rotateY(18deg) scale(0.98)',
    finalTransform: 'translate3d(1px,0px,0px) rotate(-0.1deg) rotateX(-0.0deg) rotateY(-0.1deg) scale(1)',
    zIndex: 13,
    transformOrigin: '55% 58%',
    shadowIntensity: 0.20
  },
  {
    id: 'middle-3',
    clipPath: "polygon(90.0% 21.0%, 81.2% 25.1%, 81.8% 31.4%, 77.1% 34.7%, 71.3% 29.0%, 60.4% 50.1%, 53.6% 40.3%, 53.0% 29.8%, 63.0% 21.6%, 41.5% 11.4%, 61.0% 12.6%, 64.9% 9.5%, 70.2% 13.0%, 75.7% 4.7%, 90.1% 0.0%, 79.7% 16.0%, 81.9% 19.5%)",
    initialTransform: 'translate3d(7px,-13px,26px) rotate(14deg) rotateX(-10deg) rotateY(24deg) scale(0.98)',
    finalTransform: 'translate3d(1px,0px,0px) rotate(0.4deg) rotateX(0.2deg) rotateY(-0.5deg) scale(1)',
    zIndex: 13,
    transformOrigin: '39% 45%',
    shadowIntensity: 0.26
  },
  {
    id: 'middle-4',
    clipPath: "polygon(57.0% 38.0%, 38.9% 43.6%, 53.1% 65.1%, 36.8% 64.5%, 25.6% 54.0%, 15.4% 64.3%, 14.3% 49.9%, 0.7% 49.8%, 0.1% 39.7%, 0.0% 28.7%, 5.8% 21.9%, 17.0% 23.0%, 21.3% 3.2%, 30.8% 17.8%, 46.5% 10.4%, 57.0% 19.5%, 57.7% 33.4%)",
    initialTransform: 'translate3d(3px,8px,20px) rotate(-1deg) rotateX(8deg) rotateY(23deg) scale(0.98)',
    finalTransform: 'translate3d(0px,0px,1px) rotate(0.4deg) rotateX(0.2deg) rotateY(0.5deg) scale(1)',
    zIndex: 14,
    transformOrigin: '51% 66%',
    shadowIntensity: 0.26
  },
  {
    id: 'middle-5',
    clipPath: "polygon(64.0% 68.0%, 76.7% 80.0%, 69.3% 89.5%, 60.0% 97.2%, 47.9% 94.0%, 35.7% 99.0%, 30.9% 85.8%, 14.6% 83.8%, 22.1% 69.7%, 15.6% 57.8%, 29.4% 53.2%, 34.3% 44.2%, 45.4% 53.1%, 55.3% 39.2%, 59.3% 52.2%, 76.4% 51.0%, 74.7% 64.1%)",
    initialTransform: 'translate3d(-4px,-11px,22px) rotate(-4deg) rotateX(-15deg) rotateY(17deg) scale(0.98)',
    finalTransform: 'translate3d(0px,-1px,1px) rotate(0.7deg) rotateX(0.3deg) rotateY(-0.0deg) scale(1)',
    zIndex: 12,
    transformOrigin: '33% 49%',
    shadowIntensity: 0.31
  },
  {
    id: 'middle-6',
    clipPath: "polygon(67.0% 42.0%, 51.0% 47.2%, 43.8% 47.6%, 43.7% 54.8%, 39.0% 72.0%, 29.8% 64.6%, 32.6% 47.9%, 29.0% 46.4%, 16.1% 43.5%, 17.1% 35.2%, 25.7% 31.7%, 23.9% 15.5%, 37.1% 33.0%, 44.9% 18.0%, 42.3% 36.5%, 58.8% 30.0%, 61.8% 38.7%)",
    initialTransform: 'translate3d(0px,-3px,19px) rotate(9deg) rotateX(-17deg) rotateY(-10deg) scale(0.98)',
    finalTransform: 'translate3d(0px,0px,2px) rotate(-0.5deg) rotateX(-0.3deg) rotateY(-0.5deg) scale(1)',
    zIndex: 12,
    transformOrigin: '32% 39%',
    shadowIntensity: 0.29
  },
  {
    id: 'middle-7',
    clipPath: "polygon(43.0% 38.0%, 54.5% 45.5%, 44.6% 46.3%, 46.6% 61.8%, 36.4% 49.0%, 27.1% 62.4%, 23.3% 52.1%, 9.9% 50.7%, 29.0% 38.5%, 30.3% 36.1%, 23.7% 27.7%, 22.9% 13.3%, 34.0% 19.1%, 44.3% 9.2%, 40.9% 31.7%, 56.8% 26.0%, 56.8% 35.1%)",
    initialTransform: 'translate3d(-3px,12px,25px) rotate(11deg) rotateX(-24deg) rotateY(-25deg) scale(0.98)',
    finalTransform: 'translate3d(0px,0px,2px) rotate(-0.6deg) rotateX(-0.3deg) rotateY(0.3deg) scale(1)',
    zIndex: 13,
    transformOrigin: '34% 52%',
    shadowIntensity: 0.26
  },
  {
    id: 'core-0',
    clipPath: "polygon(70.0% 55.0%, 75.7% 61.7%, 77.0% 72.4%, 66.3% 71.4%, 59.7% 74.0%, 55.6% 64.4%, 49.6% 65.4%, 45.5% 61.6%, 49.0% 55.7%, 52.3% 52.8%, 48.3% 46.0%, 48.2% 34.7%, 56.4% 30.1%, 60.4% 50.2%, 71.3% 39.2%, 74.6% 46.0%, 80.8% 51.9%)",
    initialTransform: 'translate3d(7px,-14px,37px) rotate(-5deg) rotateX(5deg) rotateY(-16deg) scale(1.0)',
    finalTransform: 'translate3d(1px,0px,2px) rotate(0.3deg) rotateX(0.1deg) rotateY(-0.2deg) scale(1)',
    zIndex: 30,
    transformOrigin: '57% 31%',
    shadowIntensity: 0.20
  },
  {
    id: 'core-1',
    clipPath: "polygon(86.0% 31.0%, 96.1% 40.7%, 87.1% 45.6%, 79.7% 48.4%, 72.1% 35.0%, 62.8% 56.4%, 65.3% 38.4%, 55.8% 38.9%, 49.1% 32.6%, 53.0% 24.8%, 53.6% 15.6%, 70.1% 27.5%, 70.6% 18.1%, 76.4% 15.6%, 75.1% 27.1%, 81.5% 25.5%, 82.9% 29.5%)",
    initialTransform: 'translate3d(-5px,-8px,31px) rotate(7deg) rotateX(11deg) rotateY(11deg) scale(1.0)',
    finalTransform: 'translate3d(0px,0px,1px) rotate(0.7deg) rotateX(0.3deg) rotateY(0.1deg) scale(1)',
    zIndex: 21,
    transformOrigin: '46% 52%',
    shadowIntensity: 0.35
  },
  {
    id: 'core-2',
    clipPath: "polygon(37.0% 59.0%, 50.9% 69.9%, 36.2% 70.8%, 26.8% 65.4%, 24.4% 70.0%, 14.4% 85.3%, 14.0% 70.1%, 8.7% 66.5%, 13.0% 59.8%, 8.8% 54.1%, 9.4% 46.8%, 19.3% 50.2%, 22.4% 44.1%, 29.2% 40.7%, 32.6% 48.0%, 44.8% 47.0%, 41.8% 56.5%)",
    initialTransform: 'translate3d(-1px,-7px,41px) rotate(-14deg) rotateX(-21deg) rotateY(-30deg) scale(1.0)',
    finalTransform: 'translate3d(0px,-1px,1px) rotate(0.1deg) rotateX(0.0deg) rotateY(-0.6deg) scale(1)',
    zIndex: 19,
    transformOrigin: '31% 61%',
    shadowIntensity: 0.19
  },
  {
    id: 'core-3',
    clipPath: "polygon(100.0% 26.0%, 92.0% 36.1%, 80.7% 39.2%, 76.4% 47.0%, 68.3% 64.0%, 56.4% 55.1%, 42.9% 52.8%, 50.8% 33.9%, 39.1% 28.0%, 41.3% 17.7%, 47.8% 9.9%, 59.0% 11.0%, 63.3% 0.0%, 72.5% 6.8%, 88.5% 0.0%, 92.1% 11.5%, 81.9% 23.9%)",
    initialTransform: 'translate3d(11px,-4px,33px) rotate(-13deg) rotateX(12deg) rotateY(21deg) scale(1.0)',
    finalTransform: 'translate3d(-1px,-1px,0px) rotate(0.5deg) rotateX(0.2deg) rotateY(0.5deg) scale(1)',
    zIndex: 18,
    transformOrigin: '69% 68%',
    shadowIntensity: 0.25
  },
  {
    id: 'core-4',
    clipPath: "polygon(50.0% 22.0%, 53.7% 28.7%, 41.3% 26.2%, 45.1% 40.3%, 37.7% 41.0%, 33.6% 31.4%, 24.3% 36.1%, 17.2% 31.6%, 14.1% 23.6%, 17.0% 15.5%, 20.1% 7.9%, 26.7% 2.6%, 35.6% 9.1%, 41.4% 6.6%, 48.1% 7.8%, 40.5% 20.0%, 61.8% 18.5%)",
    initialTransform: 'translate3d(-5px,7px,40px) rotate(-5deg) rotateX(3deg) rotateY(-31deg) scale(1.0)',
    finalTransform: 'translate3d(0px,-1px,2px) rotate(-0.2deg) rotateX(-0.1deg) rotateY(-0.7deg) scale(1)',
    zIndex: 19,
    transformOrigin: '60% 31%',
    shadowIntensity: 0.31
  },
  {
    id: 'core-5',
    clipPath: "polygon(54.0% 78.0%, 50.9% 83.6%, 61.5% 100.0%, 45.9% 98.1%, 37.8% 100.0%, 27.4% 100.0%, 19.6% 97.3%, 23.5% 84.6%, 12.1% 79.7%, 4.7% 67.5%, 11.7% 56.8%, 31.4% 67.4%, 34.5% 54.1%, 40.0% 67.4%, 53.0% 57.5%, 56.9% 66.5%, 60.8% 74.7%)",
    initialTransform: 'translate3d(-12px,-11px,43px) rotate(-8deg) rotateX(-18deg) rotateY(-32deg) scale(1.0)',
    finalTransform: 'translate3d(0px,-1px,0px) rotate(-0.6deg) rotateX(-0.3deg) rotateY(0.5deg) scale(1)',
    zIndex: 21,
    transformOrigin: '52% 31%',
    shadowIntensity: 0.21
  },
  {
    id: 'core-6',
    clipPath: "polygon(55.0% 51.0%, 65.8% 62.2%, 59.6% 71.8%, 51.8% 82.1%, 39.0% 80.0%, 28.8% 76.4%, 12.6% 79.2%, 1.1% 69.0%, 5.1% 53.3%, 10.4% 42.0%, 8.9% 26.6%, 19.2% 15.7%, 34.7% 19.2%, 49.3% 11.6%, 57.7% 25.8%, 60.5% 38.0%, 57.8% 48.2%)",
    initialTransform: 'translate3d(2px,-13px,37px) rotate(-4deg) rotateX(-39deg) rotateY(-18deg) scale(1.0)',
    finalTransform: 'translate3d(1px,0px,0px) rotate(0.2deg) rotateX(0.1deg) rotateY(-0.2deg) scale(1)',
    zIndex: 19,
    transformOrigin: '62% 59%',
    shadowIntensity: 0.31
  },
  {
    id: 'core-7',
    clipPath: "polygon(74.0% 30.0%, 67.1% 39.7%, 62.4% 48.8%, 53.6% 53.8%, 43.7% 49.0%, 34.1% 54.4%, 29.6% 44.9%, 6.1% 48.0%, 15.1% 32.0%, 13.5% 20.4%, 17.7% 8.8%, 25.6% 0.0%, 40.5% 6.1%, 52.6% 0.0%, 59.0% 9.5%, 70.7% 14.0%, 82.6% 24.4%)",
    initialTransform: 'translate3d(5px,6px,32px) rotate(-15deg) rotateX(28deg) rotateY(-20deg) scale(1.0)',
    finalTransform: 'translate3d(-1px,-1px,2px) rotate(0.4deg) rotateX(0.2deg) rotateY(-0.3deg) scale(1)',
    zIndex: 20,
    transformOrigin: '63% 54%',
    shadowIntensity: 0.23
  }
];


const CRUMPLE_SHARDS = [
  { left: '8%', top: '18%', width: '34%', height: '26%', rotate: '-18deg', clip: 'polygon(0 20%, 72% 0, 100% 64%, 42% 100%)' },
  { left: '30%', top: '4%', width: '29%', height: '35%', rotate: '11deg', clip: 'polygon(10% 0, 100% 16%, 74% 100%, 0 72%)' },
  { left: '56%', top: '8%', width: '34%', height: '32%', rotate: '19deg', clip: 'polygon(0 6%, 92% 0, 100% 82%, 28% 100%)' },
  { left: '70%', top: '29%', width: '28%', height: '35%', rotate: '-13deg', clip: 'polygon(18% 0, 100% 22%, 79% 100%, 0 76%)' },
  { left: '3%', top: '42%', width: '38%', height: '30%', rotate: '8deg', clip: 'polygon(0 15%, 73% 0, 100% 78%, 21% 100%)' },
  { left: '20%', top: '35%', width: '33%', height: '31%', rotate: '-7deg', clip: 'polygon(9% 0, 100% 17%, 81% 100%, 0 67%)' },
  { left: '45%', top: '31%', width: '36%', height: '34%', rotate: '16deg', clip: 'polygon(0 20%, 66% 0, 100% 71%, 26% 100%)' },
  { left: '62%', top: '53%', width: '34%', height: '31%', rotate: '7deg', clip: 'polygon(14% 0, 100% 12%, 78% 100%, 0 74%)' },
  { left: '7%', top: '65%', width: '32%', height: '25%', rotate: '-10deg', clip: 'polygon(0 8%, 87% 0, 100% 70%, 20% 100%)' },
  { left: '27%', top: '62%', width: '37%', height: '34%', rotate: '13deg', clip: 'polygon(6% 0, 100% 20%, 82% 100%, 0 69%)' },
  { left: '48%', top: '67%', width: '31%', height: '28%', rotate: '-17deg', clip: 'polygon(0 21%, 77% 0, 100% 84%, 19% 100%)' },
  { left: '38%', top: '17%', width: '29%', height: '29%', rotate: '-23deg', clip: 'polygon(19% 0, 100% 27%, 72% 100%, 0 66%)' }
] as const;

export function CreaseOverlay({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`${styles.creaseOverlay} ${className}`}
      viewBox="0 0 1000 720"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.creaseDark}>
        <path d="M45 102 420 338 317 706M320 18l100 320 264 185L657 712" />
        <path d="M664 28 590 230 801 312 978 430M102 590l318-252 244 185 245 82" />
        <path d="m18 440 402-102 170-108M420 338l-15 166 252 208M590 230l74 293" />
      </g>
      <g className={styles.creaseLight}>
        <path d="M51 98 424 334 323 704M327 17l99 317 261 184" />
        <path d="M670 29 597 227l208 80M106 596l318-255 241 188" />
      </g>
    </svg>
  );
}

function CrumpleCreases() {
  return (
    <svg
      className={styles.crumpleCreases}
      viewBox="0 0 300 286"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.crumpleValleys}>
        <path d="M27 68 64 83l18 39-35 28 42 19-19 45" />
        <path d="m75 24 29 43-22 55 48 12-22 50 17 72" />
        <path d="m139 16-17 50 34 40-26 28 35 48-22 83" />
        <path d="m206 24-34 53 31 43-38 62 41 42-13 42" />
        <path d="m256 57-51 63 44 29-39 35 28 41" />
        <path d="M29 191 88 169l77 13 45 2 56-31" />
        <path d="M55 49 122 66l50 11 62-21M44 228l81-44 68 40 52 4" />
      </g>
      <g className={styles.crumpleRidges}>
        <path d="M30 65 67 80l19 39-34 28 40 18-17 46" />
        <path d="m78 22 30 43-21 53 47 13-21 51 17 72" />
        <path d="m142 14-16 50 34 40-25 29 35 47-21 84" />
        <path d="m210 22-34 54 31 42-37 63 40 40-12 43" />
        <path d="m259 55-50 63 44 28-38 36 27 40" />
        <path d="M31 188 89 166l78 13 44 2 57-31" />
      </g>
      <g className={styles.crumpleScuffs}>
        <path d="m93 44 17 9m93 21 14-8m-94 151 21 9m72-71 15 8M47 112l15-3" />
        <path d="m102 96 8 6m67-56 7 8m38 151 11-3m-164 28 12 2" />
      </g>
    </svg>
  );
}

function UnfoldingFormImpression() {
  return (
    <div className={styles.unfoldingFormImpression} data-unfold-content aria-hidden="true">
      <span className={styles.impressionHeading} />
      <span />
      <span />
      <span className={styles.impressionUpload} />
      <span className={styles.impressionTextarea} />
    </div>
  );
}

export function CrumpledPaper({ transitioning = false }: { transitioning?: boolean }) {
  return (
    <div
      className={`${styles.crumpledPaper} ${
        transitioning ? styles.crumpledTransitioning : ''
      }`}
      data-paper-ball
      aria-label="A crumpled sheet stamped RN"
      role="img"
    >
      <img
        src="/assets/images/paper-ball.png"
        alt=""
        className={styles.realisticPaperBall}
        data-realistic-ball
      />
      <div className={styles.facetStage} data-facet-stage>
        {PAPER_FACETS.map((facet, index) => (
          <span
            key={facet.id}
            className={styles.paperFacet}
            data-paper-facet={facet.id}
            style={
              {
                clipPath: facet.clipPath,
                zIndex: facet.zIndex,
                transformOrigin: facet.transformOrigin,
                '--facet-index': index,
                '--facet-shadow': facet.shadowIntensity,
                '--facet-initial-transform': facet.initialTransform,
                '--facet-final-transform': facet.finalTransform
              } as CSSProperties
            }
          >
            {facet.id === 'core-0' && (
              <div className={styles.rnStamp} data-rn-stamp>
                <span>RN</span>
              </div>
            )}
          </span>
        ))}
        <span className={styles.crumpleShards} aria-hidden="true">
          {CRUMPLE_SHARDS.map((shard, index) => (
            <i
              key={`${shard.left}-${shard.top}`}
              data-crumple-shard
              style={
                {
                  left: shard.left,
                  top: shard.top,
                  width: shard.width,
                  height: shard.height,
                  clipPath: shard.clip,
                  '--crumple-shard-rotate': shard.rotate,
                  '--crumple-shard-index': index
                } as CSSProperties
              }
            />
          ))}
        </span>
        <CreaseOverlay />
        <CrumpleCreases />
        {transitioning && <UnfoldingFormImpression />}
      </div>
    </div>
  );
}

export function TornFormPaper({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.tornFormPaper} ${className}`} data-torn-form-paper>
      <span className={styles.punchedEdge} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} />
        ))}
      </span>
      <CreaseOverlay />
      <div className={styles.tornFormContent}>{children}</div>
    </div>
  );
}

export function FoldingPaperEdges() {
  return (
    <span className={styles.foldingPaperEdges} aria-hidden="true">
      <i className={styles.foldEdgeLeft} data-fold-edge="left" />
      <i className={styles.foldEdgeRight} data-fold-edge="right" />
      <i className={styles.foldEdgeTop} data-fold-edge="top" />
      <i className={styles.foldEdgeBottom} data-fold-edge="bottom" />
      <b className={styles.foldThickness} data-fold-thickness />
    </span>
  );
}

export function WaxSeal() {
  return (
    <div className={styles.waxSeal} data-wax-seal aria-hidden="true">
      <span data-wax-impression>RN</span>
    </div>
  );
}

export function SealPress() {
  return (
    <div className={styles.sealPress} data-seal-press aria-hidden="true">
      <i />
      <span>RN</span>
    </div>
  );
}

export function StringWrap() {
  return (
    <div className={styles.stringWrap} data-string-wrap aria-hidden="true">
      <span className={styles.stringHorizontal} />
      <span className={styles.stringVertical} />
      <span className={styles.stringKnot} />
    </div>
  );
}

export function ReceivedStamp() {
  return (
    <div className={styles.receivedStamp} data-received-stamp aria-hidden="true">
      RECEIVED
    </div>
  );
}

export function Envelope({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${styles.envelope} ${compact ? styles.envelopeCompact : ''}`}
      data-envelope
      aria-label="A sealed Rough Note envelope marked received"
      role="img"
    >
      <div className={styles.envelopeBack} data-envelope-back />
      <div className={styles.envelopeLeftFold} data-envelope-left />
      <div className={styles.envelopeRightFold} data-envelope-right />
      <div className={styles.envelopeBottomFold} data-envelope-bottom />
      <div className={styles.envelopeTopFlap} data-envelope-flap />
      <div className={styles.postalStamp} aria-hidden="true">
        <span>ROUGH NOTE</span>
        <strong>RN</strong>
        <small>CREATIVE STUDIO</small>
      </div>
      <StringWrap />
      <WaxSeal />
      <SealPress />
      <ReceivedStamp />
    </div>
  );
}

export function ConfidentialNote() {
  return (
    <div className={styles.confidentialMark} aria-hidden="true">
      <LockDoodle />
      <span>kept private</span>
    </div>
  );
}
