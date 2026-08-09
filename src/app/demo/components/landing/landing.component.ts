import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styles: [`
        @keyframes floatBadge1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes floatBadge2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes pulseSignal {
            0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(33, 150, 243, 0); }
            100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
        }
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 200%; }
        }
        @keyframes cardFloatMotion {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
        }

        .animated-float-1 {
            animation: floatBadge1 4s ease-in-out infinite;
        }
        .animated-float-2 {
            animation: floatBadge2 4.5s ease-in-out infinite 0.5s;
        }
        .pulse-beacon {
            animation: pulseSignal 2s infinite;
        }

        .card-motion-1 {
            animation: cardFloatMotion 5s ease-in-out infinite;
        }
        .card-motion-2 {
            animation: cardFloatMotion 5.5s ease-in-out infinite 0.6s;
        }
        .card-motion-3 {
            animation: cardFloatMotion 6s ease-in-out infinite 1.2s;
        }

        .hover-lift-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        .hover-lift-card:hover {
            animation-play-state: paused;
            transform: translateY(-10px) scale(1.02) !important;
            box-shadow: 0 20px 35px -10px rgba(33, 150, 243, 0.25) !important;
        }

        .shine-effect {
            position: relative;
            overflow: hidden;
        }
        .shine-effect::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transform: skewX(-20deg);
            animation: shine 6s infinite;
        }
    `]
})
export class LandingComponent {

    currentYear: number = new Date().getFullYear();

    constructor(public layoutService: LayoutService, public router: Router) { }
    
}
