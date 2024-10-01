export class CardMatchLogic {
    constructor(scene) {
        this.scene = scene;
        this.selectedCard = undefined;
    }

    handleCardSelect(card) {
        if (!this.scene.canMove) return;

        if (this.selectedCard === undefined) {
            this.selectedCard = card;
            card.gameObject.setTint(0x00ff00);
        } else {
            if (this.selectedCard === card) {
                card.gameObject.clearTint();
                this.selectedCard = undefined;
            } else {
                this.scene.canMove = false;
                card.gameObject.setTint(0x00ff00);

                if (this.selectedCard.cardName === card.cardName) {
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