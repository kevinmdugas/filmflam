export interface BannerProps {
    /**
     * Is this component disabled?
     */
    disabled?: boolean;
}

/**
 * Banner button that shows static "BannerLabel" text and does nothing
 */
export const Banner = ({
                           disabled = false
                       }: BannerProps) => {
    return (
        <button disabled={disabled}>
            {"BannerLabel"}
        </button>
    );
};