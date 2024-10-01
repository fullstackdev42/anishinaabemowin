export class DebugManager {
    constructor(scene) {
        this.scene = scene;
        this.debugText = null;
    }

    createDebugOverlay() {
        this.debugText = this.scene.add.text(10, 10, '', { 
            font: '16px Courier', 
            fill: '#00ff00',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 5, y: 5 }
        });
        this.debugText.setDepth(1000);
        this.debugText.setVisible(true); // Ensure it's visible by default
    }

    updateDebugInfo(gameState, gridConfiguration) {
        if (this.debugText) {
            this.debugText.setText(this.getDebugInfo(gameState, gridConfiguration));
        }
    }

    getDebugInfo(gameState, gridConfiguration) {
        return [
            `Cards remaining: ${gameState.cards.length}`,
            `Lives: ${gameState.lives}`,
            `Can move: ${gameState.canMove}`,
            `Grid config: ${JSON.stringify(gridConfiguration, null, 2)}`
        ].join('\n');
    }
}