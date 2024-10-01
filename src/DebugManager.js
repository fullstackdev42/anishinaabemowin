export class DebugManager {
    constructor(scene) {
        this.scene = scene;
        this.debugText = null;
        this.isVisible = false;  // Add this line
    }

    createDebugOverlay() {
        console.log('Creating debug overlay');
        this.debugText = this.scene.add.text(10, 10, '', { 
            font: '16px Courier', 
            fill: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 5, y: 5 }
        });
        this.debugText.setDepth(1000); // Ensure it's on top of other game objects
        this.debugText.setScrollFactor(0); // Make it stay in the same position regardless of camera movement
        this.debugText.setVisible(this.isVisible);  // Set initial visibility
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
            `Grid config: ${JSON.stringify(gridConfiguration, null, 2)}`,
            `Card positions: ${JSON.stringify(gameState.cards.map(card => ({x: card.x, y: card.y})), null, 2)}`
        ].join('\n');
    }

    // Add this new method
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        if (this.debugText) {
            this.debugText.setVisible(this.isVisible);
        }
    }
}