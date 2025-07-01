CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id),
    CONSTRAINT fk_activity
        FOREIGN KEY(activity_id)
        REFERENCES activities(id)
);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE (user_id, activity_id), -- A user can only like an activity once
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id),
    CONSTRAINT fk_activity
        FOREIGN KEY(activity_id)
        REFERENCES activities(id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    UNIQUE (user_id, activity_id), -- A user can only review an activity once
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id),
    CONSTRAINT fk_activity
        FOREIGN KEY(activity_id)
        REFERENCES activities(id)
);
