# Frontend - 실시간 모니터링 대시보드

## 프로젝트 개요

이 프로젝트는 ROS2 기반 CCTV 실시간 영상 스트리밍과 객체 탐지, 포즈 추정, 쓰러짐 감지 알림 기능을 포함하는 작업자 안전 모니터링 대시보드를 React로 구현한 프론트엔드입니다.
실시간으로 수신되는 영상과 센서 데이터를 효과적으로 시각화하고, 알림 시스템을 통해 위험 상황을 신속히 전달하는 것을 목표로 합니다.

## 주요 기능

CCTV 실시간 영상 스트리밍

객체 탐지 및 포즈 추정 결과 시각화

노드 상태 모니터링 패널

쓰러짐 감지 및 알림 시스템

반응형 UI 및 실시간 데이터 렌더링

## 사용 기술
React

TypeScript

WebSocket (ROSLIB)

TailwindCSS

## 프로젝트 구조

src/

├── components/

│   ├── common/      - 공통 UI 컴포넌트

│   ├── auth/        - 로그인  컴포넌트

│   ├── dashboard/   - 대시보드 관련 컴포넌트

│   └── video/       - 비디오 스트림 관련 컴포넌트

├── services/        - WebSocket 연결 및 데이터 처리

├── hooks/           - 커스텀 React 훅

└── pages/           - 페이지 

## 실행 방법

1. 의존성 설치

npm install

2. 실행
   
npm start
