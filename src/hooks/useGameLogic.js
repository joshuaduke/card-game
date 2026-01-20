import { useState, useEffect } from "react";

export const useGameLogic = (cardValues) => {
    const [cards, setCards] = useState([]);
	const [flippedCards, setflippedCards] = useState([]);
	const [matchedCards, setMatchedCards] = useState([]);
	const [score, setScore] = useState(0);
	const [moves, setMoves] = useState(0);
	const [isLocked, setIsLocked] = useState(false);

	const shuffleArray = (array) => {
		const shuffled = [...array]; // create copy of the arr
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)); // generate random position for item in new array
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const initializeGame = () => {
		// SHUFFLE CARDS
		const shuffled = shuffleArray(cardValues);

		const finalCards = shuffled.map((value, index) => ({
			id: index,
			value,
			isFlipped: false,
			isMatched: false,
		}));

		setCards(finalCards);
		setMoves(0);
		setScore(0);
		setMatchedCards([]);
		setflippedCards([]);
	};

	useEffect(() => {
		initializeGame();
	}, []);

	const handleCardClick = (card) => {
		//Don't allow clicking if the card is already flipped or matched
		if (
			card.isFlipped ||
			card.isMatched ||
			isLocked === true ||
			flippedCards.length === 2
		) {
			return;
		}

		//Update card flipped state
		const newCards = cards.map((c) => {
			if (c.id === card.id) {
				return { ...c, isFlipped: true };
			} else {
				return c;
			}
		});

		setCards(newCards);

		const newFlippedCards = [...flippedCards, card.id];
		setflippedCards(newFlippedCards);

		// check for match if two cards are flipped
		if (flippedCards.length === 1) {
			setIsLocked(true);
			const firstCard = cards[flippedCards[0]];

			if (firstCard.value === card.value) {
				setTimeout(() => {
					setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
					setMoves((prev) => prev + 1);
					setScore((prev) => prev + 1);
					setCards((prev) =>
						prev.map((c) => {
							if (c.id === card.id || c.id === firstCard.id) {
								return { ...c, isMatched: true };
							} else {
								return c;
							}
						}),
					);

					setflippedCards([]);
					setIsLocked(false);
				}, 500);
			} else {
				//flip back card 1, card 2
				setTimeout(() => {
					const flippedBackCard = newCards.map((c) => {
						if (
							newFlippedCards.includes(c.id) ||
							c.id === card.id
						) {
							return { ...c, isFlipped: false };
						} else {
							return c;
						}
					});

					setCards(flippedBackCard);
					setflippedCards([]);
					setIsLocked(false);
				}, 1000);

				setMoves((prev) => prev + 1);
			}
		}
	};

	const isGameComplete = matchedCards.length === cardValues.length;

    return {cards, score, moves, isGameComplete, initializeGame, handleCardClick}
}