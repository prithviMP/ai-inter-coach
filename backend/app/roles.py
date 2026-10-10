from dataclasses import dataclass


@dataclass(frozen=True)
class Role:
    id: str
    title: str
    blurb: str
    opening_question: str
    dimensions: tuple[str, ...]
    follow_up_hint: str


ROLES: dict[str, Role] = {
    "sde": Role(
        id="sde",
        title="SDE",
        blurb="Explain an approach out loud. No code runner.",
        opening_question=(
            "Walk through how you would find two numbers in an unsorted list "
            "that add up to a target, and talk about time and space."
        ),
        dimensions=(
            "Problem framing",
            "Approach",
            "Complexity",
            "Edge cases",
            "Explanation",
        ),
        follow_up_hint=(
            "Probe the approach they named: a missed edge case, a complexity "
            "claim, or a data structure they mentioned."
        ),
    ),
    "pm": Role(
        id="pm",
        title="Product manager",
        blurb="One product-sense case.",
        opening_question=(
            "A food-delivery app's orders are flat while restaurants are joining. "
            "What would you look at in the next two weeks?"
        ),
        dimensions=(
            "Problem definition",
            "User",
            "Prioritisation",
            "Metrics",
            "Trade-offs",
            "Structure",
        ),
        follow_up_hint=(
            "Challenge one metric or one user group they mentioned."
        ),
    ),
    "finance": Role(
        id="finance",
        title="B.Com / finance analyst",
        blurb="Interpret a tiny set of figures.",
        opening_question=(
            "Revenue is 100, cost of goods is 60, and operating expenses are 30. "
            "What is the operating margin, and what does it tell you?"
        ),
        dimensions=(
            "Calculation",
            "Concept",
            "Interpretation",
            "Structure",
        ),
        follow_up_hint=(
            "Probe the interpretation they gave, or a number they skipped."
        ),
    ),
}

MAX_SCORE = 4


def get_role(role_id: str) -> Role | None:
    return ROLES.get(role_id)
