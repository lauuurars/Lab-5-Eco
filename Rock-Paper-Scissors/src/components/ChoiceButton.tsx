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
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="
            bg-black text-white
            px-6 py-4 rounded-xl
            disabled:opacity-50
      "
        >
            {choice}
        </button>
    )
}