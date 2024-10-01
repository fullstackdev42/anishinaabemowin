export class CardMatchLogic {
    constructor(scene) {
        this.scene = scene;
        this.selectedCard = undefined;
    }

    handleCardSelect(card) {
        if (!this.scene.canMove) return;
    
        if (this.selectedCard === undefined) {
            this.selectedCard = card;
            card.gameObject.first.setStrokeStyle(2, 0x00ff00);
        } else {
            if (this.selectedCard === card) {
                card.gameObject.first.setStrokeStyle(2, 0x000000);
                this.selectedCard = undefined;
            } else {
                this.scene.canMove = false;
                card.gameObject.first.setStrokeStyle(2, 0x00ff00);
    
                const [selectedEnglish, selectedOjibwe] = this.selectedCard.cardName.split('-');
                const [currentEnglish, currentOjibwe] = card.cardName.split('-');
    
                if (selectedEnglish === currentEnglish && selectedOjibwe === currentOjibwe) {
                    this.handleMatch(this.selectedCard, card);
                } else {
                    this.handleMismatch(this.selectedCard, card);
                }
                this.scene.checkGameStatus();
            }
        }
    }

    handleMatch(card1, card2) {
        this.scene.sound.play("card-match");
        this.scene.time.delayedCall(500, () => {
            card1.destroy();
            card2.destroy();
            this.scene.cardGrid.removeCard(card1);
            this.scene.cardGrid.removeCard(card2);
            this.selectedCard = undefined;
            this.scene.canMove = true;
        });
    }

    handleMismatch(card1, card2) {
        this.scene.sound.play("card-mismatch");
        this.scene.cameras.main.shake(600, 0.01);
        this.scene.time.delayedCall(1000, () => {
            card1.gameObject.clearTint();
            card2.gameObject.clearTint();
            this.selectedCard = undefined;
            this.scene.removeLife();
            this.scene.canMove = true;
        });
    }
}