import type { Choice } from "../types/game.types"

interface Props {
    choice: Choice
    onClick: () => void
    disabled?: boolean
}

export default function ChoiceButton({
    choice,
    onClick,
    disabled
}: Props) {
    const emojiByChoice: Record<Choice, string> = {
        Piedra: "🪨",
        Papel: "📄",
        Tijeras: "✂️",
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="bg-violet-500 hover:bg-violet-700 transition-all 
            text-white px-6 py-4 font-medium rounded-xl
            disabled:opacity-50 cursor-pointer"
        >
            <span className="flex items-center gap-2">
                <span className="text-xl">{emojiByChoice[choice]}</span>
                <span>{choice}</span>
            </span>
        </button>
    )
}
